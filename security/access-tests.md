# Matriks Akses dan Laporan Uji Otorisasi (Access Tests)

**Milestone:** `sec-0.2`  
**Mata Kuliah:** Keamanan Komputasi dan Siber (052353)  
**Produk:** Piloty Comment (Moderasi Otomatis Komentar YouTube)  
**Prinsip Desain:** *Least Privilege*, *Separation of Duties*, & *Default Deny* (NIST SP 800-162 / CIS Benchmark)

---

## 1. Matriks Hak Akses Berbasis Peran (RBAC Matrix)

Produk Piloty Comment membagi kewenangan ke dalam 3 entitas peran:
1. **`ADMIN` (Channel Owner):** Pemilik saluran YouTube dengan otoritas administratif penuh atas pengaturan, aturan moderasi, dan akun.
2. **`MODERATOR`:** Anggota tim peninjau yang berhak memantau dasbor dan memoderasi komentar publik, namun **dilarang keras** mengubah aturan moderasi sistem (*Rules*) atau mengelola kredensial akun (*Settings*).
3. **`UNAUTHENTICATED` (Tamu / Publik):** Pengguna luar yang belum terotentikasi, hanya diizinkan mengakses halaman masuk (*login*) dan pendaftaran (*signup*). Seluruh rute internal ditutup secara ketat (*fail-closed*).

### Tabel Matriks Akses Sumber Daya

| Sumber Daya / Aksi | Rute / Identitas | ADMIN (Owner) | MODERATOR | UNAUTHENTICATED | Catatan Keamanan |
| :--- | :--- | :---: | :---: | :---: | :--- |
| Halaman Login & Signup | `/auth/login`, `/auth/signup` | ✅ Boleh | ✅ Boleh | ✅ Boleh | Terbuka untuk umum |
| Dashboard Ringkasan | `/` | ✅ Boleh | ✅ Boleh | ❌ Ditolak (302) | Wajib sesi aktif |
| Daftar & Stat Video | `/video`, `/video/[id]` | ✅ Boleh | ✅ Boleh | ❌ Ditolak (302) | Wajib sesi aktif |
| Tinjau & Moderasi Komentar | `/comments` | ✅ Boleh | ✅ Boleh | ❌ Ditolak (302) | Hak operasional moderator |
| Konfigurasi Aturan Kata Kunci | `/rules` | ✅ Boleh | ❌ Ditolak (403) | ❌ Ditolak (302) | Least privilege: hanya Admin |
| Pengaturan Akun & Profil | `/settings` | ✅ Boleh | ❌ Ditolak (403) | ❌ Ditolak (302) | Informasi sensitif: hanya Admin |
| Server Action: Ubah Email | `perbaruiEmail` | ✅ Boleh | ❌ Ditolak (403) | ❌ Ditolak (302) | Mencegah pembajakan akun |
| Server Action: Ubah Password | `perbaruiKataSandi` | ✅ Boleh | ❌ Ditolak (403) | ❌ Ditolak (302) | Mencegah pengambilalihan akun |
| Server Action: Hapus Akun | `hapusAkunPengguna` | ✅ Boleh | ❌ Ditolak (403) | ❌ Ditolak (302) | Tindakan destruktif permanen |

---

## 2. Pelaksanaan Pengujian Hak Akses

Pengujian dieksekusi secara otomatis melalui modul penegak RBAC `lib/auth/rbac.ts` dan test runner `tests/access_and_password_tests.ts`.

> **Ketentuan Mutlak:** Jumlah skenario uji negatif (akses tidak sah yang harus ditolak) **sama banyaknya** dengan uji positif (rasio seimbang 50:50).

### A. Uji Positif (Akses Sah Diizinkan - 6 Skenario)

| ID Uji | Peran | Target Akses | Ekspektasi | Hasil Riil | Status | Justifikasi Keamanan |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **POS-01** | `ADMIN` | `/` (Dashboard) | 200 OK | 200 OK | **PASSED** | Akses sah untuk pemilik sistem. |
| **POS-02** | `ADMIN` | `/rules` (Manajemen Aturan) | 200 OK | 200 OK | **PASSED** | Admin memiliki hak konfigurasi aturan filter. |
| **POS-03** | `ADMIN` | `/settings` (Pengaturan Akun) | 200 OK | 200 OK | **PASSED** | Admin berhak mengelola akun dan kredensial sendiri. |
| **POS-04** | `MODERATOR` | `/` (Dashboard) | 200 OK | 200 OK | **PASSED** | Moderator memerlukan dasbor untuk metrik moderasi. |
| **POS-05** | `MODERATOR` | `/comments` (Moderasi) | 200 OK | 200 OK | **PASSED** | Tugas operasional utama peran moderator. |
| **POS-06** | `UNAUTHENTICATED` | `/auth/login` (Login Publik) | 200 OK | 200 OK | **PASSED** | Rute publik pembuktian identitas awal. |

### B. Uji Negatif (Akses Tidak Sah Ditolak - 6 Skenario)

| ID Uji | Peran Uji | Target Akses Terlarang | Ekspektasi | Hasil Riil | Status | Mitigasi Risiko |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **NEG-01** | `MODERATOR` | Rute `/rules` | 403 Forbidden | 403 Forbidden | **PASSED** | Mencegah perubahan aturan filter oleh staf. |
| **NEG-02** | `MODERATOR` | Rute `/settings` | 403 Forbidden | 403 Forbidden | **PASSED** | Mencegah moderator membaca/mengubah kredensial pemilik. |
| **NEG-03** | `MODERATOR` | Aksi `DELETE_ACCOUNT` | 403 Forbidden | 403 Forbidden | **PASSED** | Mencegah sabotase internal penghapusan akun. |
| **NEG-04** | `UNAUTHENTICATED` | Rute `/` (Dashboard) | 302 Redirect | 302 Redirect | **PASSED** | *Default deny* untuk pengunjung tanpa tiket sesi. |
| **NEG-05** | `UNAUTHENTICATED` | Rute `/settings` | 302 Redirect | 302 Redirect | **PASSED** | Mencegah *information disclosure* konfigurasi akun. |
| **NEG-06** | `UNAUTHENTICATED` | Rute `/comments` | 302 Redirect | 302 Redirect | **PASSED** | Melindungi privasi data komentar dari akses anonim. |

### Ringkasan Kuantitatif Uji Akses
* **Total Uji Positif:** 6 (50%)
* **Total Uji Negatif:** 6 (50%)
* **Rasio Uji Positif : Negatif:** 1:1 (Seimbang)
* **Tingkat Keberhasilan:** 12 / 12 (100% Lulus, seluruh akses tidak sah berhasil diblokir).

---

## 3. Bukti Verifikasi Penyimpanan Kata Sandi (Slow Hash Function)

Sesuai pedoman **NIST SP 800-63B-4** dan materi Pekan 04, kata sandi pengguna tidak boleh disimpan dalam bentuk *plaintext* maupun hash cepat (*fast hash* seperti MD5 atau SHA-256 yang rentan diserang via GPU/ASIC cluster).

Produk mengimplementasikan **`scrypt`** (RFC 7914) dengan parameter lambat pada [`lib/utils/password.ts`](../lib/utils/password.ts).

### Pembuktian Tanpa Membuka Data Pengguna Riil (Menggunakan Akun Sintetis)

```text
================================================================================
   BUKTI VERIFIKASI FUNGSI HASH LAMBAT (SCRYPT KDF - NIST SP 800-63B)          
================================================================================

[1] Pembangkitan Garam Kriptografis (CSPRNG Salt - 16 bytes):
    Salt Akun Uji 1 (Hex) : 713b80fb223f55bacb45e96fa705ed96
    Salt Akun Uji 2 (Hex) : 00b2cc9f2d9d9e22cfceb8e3234c73cd
    Verifikasi Keunikan   : BERHASIL (CSPRNG menjamin keunikan per baris akun,
                            menonaktifkan serangan Rainbow Table dan Batch Attack).

[2] Komputasi Hash Lambat (scrypt keylen=64 bytes):
    Masukan Kata Sandi    : [DATA SINTETIS DILINDUNGI]
    Hash Output (Trunc.)  : d8bd4c84ad02a7752489d68252a4c876... (Total 128 karakter hex)
    Waktu Eksekusi CPU    : 68.44 ms
    Analisis Kinerja Keamanan:
    - Hash cepat (SHA-256) membutuhkan < 0.001 ms per kalkulasi (miliaran tebakan/detik di GPU).
    - scrypt membutuhkan ~68 ms per kalkulasi, membatasi laju penyerangan offline guessing
      maksimal ~14 tebakan/detik per inti prosesor bila basis data bocor.

[3] Hasil Verifikasi Komparasi:
    - Kata sandi cocok    : VALID (Otentikasi berhasil)
    - Kata sandi salah    : DITOLAK (Gagal tertutup / Fail-closed)
    - Salt dipalsukan     : DITOLAK (Hash tidak cocok, integritas terjaga)
    - Komparasi Waktu     : Menggunakan timingSafeEqual() mencegah Side-Channel Timing Attack.
```

---

## 4. Keterkaitan dengan Register Risiko (Tugas 1)

1. **Rujukan T-01 (Session Hijacking):** Sesi pengguna menggunakan cookie bertanda `HttpOnly` (kebal pencurian XSS browser), `Secure: true` (hanya HTTPS), dan `SameSite: "lax"`, dengan validasi otorisasi peran pada setiap panggilan.
2. **Rujukan T-02 (Brute Force Authentication):** Pembatasan laju login dan fungsi hash lambat *scrypt* menjamin serangan *online* maupun *offline guessing* gagal mencapai throughput yang berbahaya.
3. **Rujukan T-06 (Database Credential Breach):** Kebocoran tabel akun tidak membocorkan kata sandi asli karena salt acak 16 byte serta *scrypt memory-hard cost* menggagalkan serangan *precomputed rainbow tables*.
