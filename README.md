# Piloty Comment

## Konsep Produk

**Nama Produk:** Piloty Comment
**Tujuan:** Menyediakan platform berbasis web (dashboard) bagi YouTuber dan Publisher untuk mengelola, menyaring, dan memoderasi komentar secara otomatis sebelum atau setelah dipublikasikan, guna menjaga kualitas interaksi di kanal mereka.

**Sasaran Pengguna:** 
- YouTuber (Content Creator)
- Manajer Komunitas / Moderator Kanal YouTube
- Publisher Video Digital

**Permasalahan yang Diselesaikan:**
- Banyaknya komentar spam, tautan mencurigakan, dan bahasa tidak pantas (hate speech/toxic) yang merusak citra kanal.
- Keterbatasan waktu kreator untuk meninjau ribuan komentar secara manual.
- Kurangnya sistem sentralisasi yang intuitif untuk mengatur aturan penyaringan kata kunci spesifik.

**Fitur Awal (Milestone 1):**
- **Dashboard Overview:** Ringkasan statistik jumlah komentar masuk, diblokir, disetujui, dan menunggu peninjauan manual.
- **Manajemen Komentar:** Tabel daftar komentar dengan fitur pencarian, filter berdasarkan status (Allowed, Pending, Blocked), serta aksi pengubahan status secara manual.
- **Konfigurasi Aturan Moderasi (Rules):** Antarmuka untuk menghidupkan/mematikan aturan deteksi spam, deteksi tautan, serta menambahkan kata kunci terlarang (Blocked keywords).
- **Simulasi Pemindaian (Scan):** Fitur untuk mendemonstrasikan bagaimana sistem secara otomatis memindai dan memberikan status pada komentar berdasarkan aturan yang telah ditetapkan (saat ini menggunakan data tiruan lokal).

**Teknologi yang Digunakan:**
- **Frontend:** React, Next.js (App Router), TypeScript.
- **Styling:** Tailwind CSS (dengan pendekatan utility-first dan custom CSS scoped).
- **Kriptografi & Backend (Persiapan):** Python (menggunakan `hashlib`, `os`, `hmac` untuk kriptografi dasar) - akan diintegrasikan pada milestone berikutnya.

**Struktur Aplikasi Awal:**
Aplikasi web ini menggunakan arsitektur modular sederhana namun tidak berlebihan (Single File Architecture pada tahap purwarupa):
- `page.tsx`: Komponen utama yang mengatur State management (React Hooks: `useState`, `useMemo`).
- `StatCard`: Komponen *reusable* untuk menampilkan kartu statistik.
- `CommentTable`: Komponen *reusable* untuk merender tabel daftar komentar.
- `GuideStep`: Komponen *reusable* untuk instruksi penggunaan presentasi.
*(Catatan: Ke depannya komponen ini dapat dipisah ke dalam folder `components/` untuk modularitas lebih lanjut).*

**Petunjuk Menjalankan Aplikasi Web:**
1. Pastikan Anda telah menginstal Node.js dan npm/yarn.
2. Clone repository ini.
3. Buka terminal di direktori proyek, jalankan `npm install` untuk menginstal dependensi (Next.js, React, Tailwind CSS).
4. Jalankan perintah `npm run dev` untuk memulai server pengembangan lokal.
5. Buka `http://localhost:3000` di peramban web (browser) Anda.

## Kebutuhan Kriptografi dan Perlindungan Data

### Tabel Kebutuhan Kriptografi

| No | Data yang Dilindungi | Tujuan Keamanan (CIA) | Ancaman yang Dimitigasi | Prioritas |
|:---|:---|:---|:---|:---|
| 1 | Kata Sandi *User* (Login) | Kerahasiaan (Confidentiality) | Kredensial ditebak melalui kebocoran database (*Credential Stuffing / Rainbow Table*) | Tinggi |
| 2 | Sesi / Cookie Pengguna | Integritas (Integrity) & Kerahasiaan | Sesi dibajak oleh pihak ketiga (*Session Hijacking / Tampering*) | Tinggi |
| 3 | Log / Catatan Aktivitas | Integritas (Integrity) | Data log dimanipulasi atau dihapus untuk menutupi jejak aktivitas peretas | Menengah |

Berdasarkan analisis pemodelan ancaman pada lingkungan *single-tenant*, berikut adalah kebutuhan kriptografi esensial untuk Piloty Comment:

| Kebutuhan Kriptografi | Tujuan Keamanan | Prioritas |
| :--- | :--- | :--- |
| **Penggunaan Key Derivation Function (KDF)**<br>Kata sandi login *Publisher* tidak disimpan dalam *plaintext*, melainkan diturunkan menggunakan algoritma KDF terstandarisasi (seperti PBKDF2, Argon2, atau Scrypt). | Kerahasiaan (*Confidentiality*) & Perlindungan dari kebocoran data (Brute-force/Rainbow Table). | Tinggi |
| **Penggunaan Pustaka Kriptografi Standar**<br>Menghindari penggunaan sandi klasik (seperti Caesar/Vigenere) atau algoritma usang (seperti MD5/SHA1) untuk melindungi integritas dan kerahasiaan data sensitif, dengan memanfaatkan algoritma modern seperti SHA-256. | Integritas (*Integrity*) & Kekuatan Kriptografis yang tahan dari analisis frekuensi. | Tinggi |
| **Pembangkitan Nilai Acak yang Aman (Secure Randomness)**<br>Pembuatan *salt* untuk *hashing* dan *nonce* untuk sesi menggunakan Cryptographically Secure Pseudorandom Number Generator (CSPRNG). | Keunikan (mencegah *hash collision*) & Mitigasi *Replay Attack*. | Tinggi |


### Rancangan Komponen (Sistem Hashing Kata Sandi)
- **Fungsi:** Mengubah kata sandi asli menjadi format hash yang aman untuk disimpan, dan memverifikasi kata sandi saat *User* login.
- **Masukan (Input):** Kata sandi dalam bentuk *plaintext* (teks biasa).
- **Proses:** 
  1. Menghasilkan *salt* acak (ukuran 16 byte).
  2. Menggunakan fungsi derivasi kunci PBKDF2 dengan algoritma HMAC-SHA256 dan maksimal 210.000 iterasi.
  3. Menggabungkan *salt* dan hasil hash.
- **Keluaran (Output):** Teks (string heksadesimal) yang berisi *salt* dan hash, dipisahkan oleh karakter tertentu (misal: `salt:hash`).
- **Representasi Data:** 
  - Masukan: String (UTF-8).
  - Keluaran: String berformat `<salt_hex>:<hash_hex>`.
- **Sumber Keacakan:** Menggunakan fungsi `os.urandom()` bawaan sistem operasi yang cryptographically secure.

### Cara Menjalankan Modul Kriptografi

1. Pastikan Python 3.x telah terinstal.
2. Modul utama berada di `crypto/core_crypto.py`.
3. Untuk menjalankan pengujian otomatis (Test), jalankan perintah berikut di terminal pada direktori root proyek:
   ```bash
   python -m unittest crypto.test_core_crypto -v

   atau

   py -m unittest crypto.test_core_crypto -v
   ```
4. Output terminal akan menampilkan hasil eksekusi 4 skenario uji (3 positif, 1 negatif).
