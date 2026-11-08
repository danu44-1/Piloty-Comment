# KEPUTUSAN.md — Arsitektur dan Keputusan Kriptografi (Piloty Comment v0.2)

> **Mata Kuliah:** Kriptografi (Semester Ganjil 2026/2027)  
> **Tugas 2:** Enkripsi Terautentikasi (AEAD) dan Integritas Data (tag `v0.2`)  
> **Produk:** Piloty Comment (YouTube Comment Moderation Dashboard)  
> **Pola Integrasi:** Kunci Mengalir (*Key Flows*): KDF (Tugas 1) ➔ AES-256-GCM (Tugas 2)

---

## 1. Matriks Keputusan: Kebutuhan ➔ Mekanisme ➔ Alasan

Berdasarkan analisis ancaman STRIDE (`security/threat-model.md`) dan inventaris aset (`security/asset-inventory.md`), berikut adalah penetapan keputusan kriptografi pada Piloty Comment:

| No | Kebutuhan Perlindungan Data Produk | Mekanisme Kriptografi yang Dipilih | Alasan Pemilihan & Keunggulan Keamanan |
| :-: | :--- | :--- | :--- |
| **1** | **Kerahasiaan & Integritas Kredensial YouTube API / OAuth Token Publisher (`DA-02` / `DA-04`)**<br>Token API mengendalikan akses kanal YouTube. Jika database bocor, token tidak boleh terbuka (*confidentiality*). Token juga tidak boleh dapat dimodifikasi tanpa terdeteksi (*integrity*). | **Enkripsi Terautentikasi (AEAD) menggunakan AES-256-GCM** (*Galois/Counter Mode*, NIST SP 800-38D). | Enkripsi simetris murni (seperti AES-CBC atau AES-CTR) tidak memberikan jaminan integritas data dan rentan terhadap manipulasi bit (*bit-flipping attack*) serta serangan *padding oracle* (Vaudenay, 2002). AES-GCM menggabungkan enkripsi CTR dengan autentikasi Galois MAC dalam satu operasi primitif yang cepat, terstandarisasi, dan terbukti aman terhadap serangan *Chosen-Ciphertext Attack* (IND-CCA2). |
| **2** | **Pencegahan Pemindahan Ciphertext Antar-Akun (*Context Binding*)**<br>Mencegah penyerang menyalin token terenkripsi milik satu kanal YouTube dan memasangnya pada kanal lain di dalam database (*token replay / confusion attack*). | **Associated Additional Data (AAD)** diikatkan pada proses enkripsi AES-GCM menggunakan identitas Publisher (`channel_id` atau `publisher_uuid`). | AAD ikut diotentikasi ke dalam 128-bit authentication tag tanpa dienkripsi. Jika penyerang memindahkan ciphertext ke akun lain, proses dekripsi akan menolak secara otomatis (*fail-closed*) karena AAD tidak cocok, sehingga token tidak dapat disalahgunakan lintas kanal. |
| **3** | **Pembangkitan Kunci dari Kredensial Publisher (Integrasi Komponen T1 ➔ T2)**<br>Kunci enkripsi simetris tidak boleh dibuat dari fungsi hash cepat (seperti SHA-256 biasa) karena rentan *dictionary attack*. Kunci harus diturunkan dari master secret milik publisher. | **Key Derivation Function (KDF) PBKDF2-HMAC-SHA256** dari Tugas 1 (`crypto/core_crypto.py`), dengan parameter 210.000 iterasi dan *salt* 16 byte unik CSPRNG. | Menerapkan pola integrasi **Kunci Mengalir (*Key Flows*)** sesuai materi kuliah Minggu 06. Modul T2 (`aead_crypto.py`) mengimpor dan memanggil KDF T1 (`core_crypto.py`) untuk menurunkan kunci 256-bit (32 byte). Kunci diturunkan secara dinamis saat dibutuhkan tanpa menyimpan kunci simetris mentah di disk. |
| **4** | **Pencegahan Bencana Nonce-Reuse (*The Forbidden Attack*)**<br>Pengulangan nilai nonce pada AES-GCM dengan kunci yang sama berakibat fatal: kunci autentikasi Galois dapat bocor dan kerahasiaan berubah menjadi *two-time pad*. | **Pembangkitan Nonce 96-bit (12 byte) Segar menggunakan CSPRNG** (`secrets.token_bytes(12)`) pada setiap kali fungsi enkripsi dijalankan. | NIST SP 800-38D merekomendasikan panjang nonce 96 bit untuk AES-GCM. Pembangkitan acak dengan CSPRNG memastikan probabilitas tabrakan nonce dapat diabaikan hingga miliaran enkripsi per kunci. |
| **5** | **Penyimpanan Kunci di Luar Repositori**<br>Kunci master atau kata sandi tidak boleh tersimpan dalam *source code* repositori Git. | **Pemuatan via Variabel Lingkungan (`PILOTY_MASTER_KEY`)** dengan *fallback* file profil rahasia berizin terbatas di luar repositori. | Memenuhi Ketentuan Implementasi LMS dan praktik terbaik NIST SP 800-57. Kunci tidak pernah ter-commit ke riwayat git atau tercetak di log aplikasi. |

---

## 2. Parameter Kriptografi Terdokumentasi

Berikut adalah spesifikasi parameter teknis yang diterapkan pada berkas implementasi `crypto/aead_crypto.py`:

* **Algoritma Primitif:** AES-GCM (*Advanced Encryption Standard in Galois/Counter Mode*)
* **Pustaka Kriptografi:** Pustaka terstandarisasi dan terpelihara `cryptography.hazmat.primitives.ciphers.aead.AESGCM` (Python).
* **Panjang Kunci Enkripsi ($K$):** 256 bit (32 byte), diturunkan dari master password melalui PBKDF2-HMAC-SHA256 (210.000 iterasi) atau dibangkitkan via CSPRNG `AESGCM.generate_key(bit_length=256)`.
* **Panjang Nonce / IV ($N$):** 96 bit (12 byte), dibangkitkan segar (*fresh random*) via `secrets.token_bytes(12)`.
* **Panjang Tag Otentikasi ($T$):** 128 bit (16 byte), dihitung secara otomatis oleh GMAC pada akhir ciphertext.
* **Associated Additional Data (AAD):** String kanonis identitas kanal/publisher (misal: `channel:UC_danu_piloty_2026`) yang dinormalkan ke byte UTF-8.
* **Representasi Serialisasi Data:**
  $$\text{Payload} = \text{base64}(\text{salt}_{16\text{B}} \parallel \text{nonce}_{12\text{B}} \parallel \text{ciphertext} \parallel \text{tag}_{16\text{B}})$$
  Format ini memastikan seluruh elemen yang dibutuhkan untuk verifikasi dan dekripsi tersimpan secara portabel dan aman.

---

## 3. Penanganan Masukan dan Prinsip Gagal Tertutup (*Fail-Closed*)

Sesuai materi kuliah Minggu 06 Bagian B (*Penanganan Masukan & Batas Kepercayaan*):
1. **Validasi Allowlist:** Masukan plaintext dan AAD diperiksa tipe datanya (`str` atau `bytes`) dan dinormalkan menggunakan UTF-8. Input yang kosong atau bertipe salah ditolak sebelum menyentuh fungsi kriptografi.
2. **Prinsip Gagal Tertutup (*Fail-Closed*):**
   * Jika ciphertext dimodifikasi sekecil 1 bit pun, dekripsi langsung melempar galat `AuthenticationError` (membungkus `InvalidTag`).
   * Jika tag dimodifikasi atau kunci yang dimasukkan salah, operasi dekripsi dibatalkan dan mengembalikan pesan kesalahan umum tanpa membocorkan informasi *plaintext* atau kunci.
   * Ragu atau terjadi anomali integritas berarti **TOLAK**.

---

## 4. Hubungan Komponen Lanjutan (T1 ➔ T2)

Alur integrasi komponen di dalam repositori:

```text
[Input: Master Password & Data Sensitif]
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│ KOMPONEN T1 (v0.1) — crypto/core_crypto.py             │
│ • Fungsi: KDF PBKDF2-HMAC-SHA256 (210.000 iterasi)     │
│ • Sumber Salt: CSPRNG 16 byte                          │
└────────────────────────────────────────────────────────┘
                  │
                  │ (Kunci 32 byte mengalir)
                  ▼
┌────────────────────────────────────────────────────────┐
│ KOMPONEN T2 (v0.2) — crypto/aead_crypto.py             │
│ • Mengimpor AuthCrypto dari core_crypto.py             │
│ • Enkripsi Terautentikasi: AES-256-GCM                 │
│ • Nonce Unik: 12 byte CSPRNG (secrets.token_bytes)     │
│ • Context Binding: Associated Data (AAD = channel_id)  │
└────────────────────────────────────────────────────────┘
                  │
                  ▼
[Keluaran: Payload Terautentikasi (Salt + Nonce + Ciphertext + Tag)]
```

Uji yang melintasi sambungan (`crypto/test_aead_crypto.py`):
Jika sambungan ke KDF T1 diubah (misalnya iterasi atau algoritma tidak sesuai), kunci yang dihasilkan akan berbeda, sehingga verifikasi tag pada T2 akan gagal dan melempar `AuthenticationError`.
