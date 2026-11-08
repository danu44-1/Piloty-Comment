# Piloty Comment (v0.2)

> **Platform Web Moderasi Komentar Video YouTube Otomatis & Terpusat**  
> *Pengembangan Terintegrasi: Praktikum Pengembangan Aplikasi Web, Keamanan Komputasi & Siber, dan Kriptografi.*

---

## 1. Konsep Produk

**Nama Produk:** Piloty Comment  
**Tujuan:** Menyediakan platform berbasis web (dashboard) bagi YouTuber dan Digital Publisher untuk mengelola, menyaring, dan memoderasi komentar secara otomatis guna menjaga kualitas dan keamanan interaksi di kanal mereka.

**Sasaran Pengguna:**
* YouTuber & Content Creator
* Manajer Komunitas & Moderator Kanal YouTube
* Digital Media Publisher

**Permasalahan yang Diselesaikan:**
* Maraknya komentar spam, promosi penipuan (*scam*), tautan berbahaya (*phishing*), dan ujaran kebencian (*toxic/hate speech*).
* Keterbatasan waktu kreator untuk memeriksa ribuan komentar audiens secara manual satu per satu.
* Belum tersedianya sistem sentralisasi yang intuitif untuk menetapkan kata kunci terlarang dan aturan moderasi yang adaptif.

---

## 2. Perkembangan Fitur dari v0.1 ke v0.2

| Area Pengembangan | Versi Awal (Milestone 1 — v0.1) | Versi Saat Ini (Milestone 2 — v0.2) |
| :--- | :--- | :--- |
| **Arsitektur Aplikasi** | Prototipe UI sederhana berbasis *client-side state* (`page1.tsx`). | **Next.js App Router (Pekan 4)** dengan rute modular (`/`, `/video`, `/video/[id]`, `/comments`, `/rules`, `/settings`, `/auth/*`), penanganan batas error, loading, dan *not-found* dinamis. |
| **Logika Server** | Belum ada logika server; murni manipulasi state di memori peramban. | **Server Actions (Pekan 5)** dengan arahan `"use server"` untuk pendaftaran, autentikasi, perpanjangan sesi, pembaruan profil, dan penghapusan akun. |
| **Validasi Sisi Server** | Validasi dasar di sisi klien (HTML5 / JS). | **Validasi Kuat Zod (Pekan 5 & 6)** dengan penolakan masukan tidak sah di server, penanganan pesan galat per field (*field-level errors*), dan pemetaan kode unik Prisma `P2002`. |
| **Pengelolaan Database** | Belum terhubung database (*mock data* lokal). | **PostgreSQL & Prisma ORM 7 (Pekan 6)** dengan adapter `@prisma/adapter-pg`, konfigurasi modern `prisma.config.ts`, migrasi skema terkelola, dan data *seeding* sintetis idempoten. |
| **Operasi CRUD** | Hanya simulasi *in-memory* pada komentar lokal. | **CRUD Lengkap pada Kedua Entitas (`User` & `Session`) melalui Antarmuka Web**: Create, Read, Update, dan Delete dapat diakses langsung oleh pengguna melalui UI `/auth` dan `/settings`. |
| **Integritas Relasi Data** | Belum ada relasi data persisten. | Relasi **1-to-Many (`User` 1 — * `Session`)** dengan *foreign key constraint* `onDelete: Restrict` dan penghapusan atomik dalam transaksi `prisma.$transaction`. |
| **Keamanan Sesi & KDF** | Eksperimen kriptografi terpisah di Python. | **Integrasi KDF Standar Industri (`scrypt` + CSPRNG salt 16-byte)** di Next.js, serta cookie sesi dengan flag `HttpOnly`, `SameSite: Lax`, dan `Secure`. |
| **Persistensi Antarmuka** | Data kembali ke default saat halaman di-*refresh*. | Seluruh perubahan profil dan sesi tersimpan di PostgreSQL; perubahan filter dan komentar terlindungi persistensi lokal. |

---

## 3. Desain Database & Relasi Entitas (Prisma ORM 7)

Aplikasi menggunakan database relasional **PostgreSQL** yang dikelola melalui **Prisma ORM 7.10.1**. Skema database memodelkan minimal dua entitas yang saling berelasi erat:

```text
       ┌────────────────────────┐
       │         User           │
       ├────────────────────────┤
       │ id (PK, Int)           │ 1
       │ uuid (UNIQUE, String)  │
       │ email (UNIQUE, String) │
       │ salt (String)          │
       │ passwordHash (String)  │
       │ createdAt (DateTime)   │
       │ updatedAt (DateTime)   │
       └───────────┬────────────┘
                   │
                   │ 1 - to - Many
                   │ onDelete: Restrict
                   │ onUpdate: Cascade
                   ▼
       ┌────────────────────────┐
       │        Session         │
       ├────────────────────────┤
       │ id (PK, Int)           │ *
       │ uuid (UNIQUE, String)  │
       │ userId (FK -> User.id) │
       │ expiresAt (DateTime)   │
       │ createdAt (DateTime)   │
       └────────────────────────┘
```

* **Entitas `User`:** Menyimpan kredensial publisher dengan proteksi *salt* unik dan derivasi hash password.
* **Entitas `Session`:** Menyimpan token sesi aktif dengan pengenal acak aman (UUIDv4 CSPRNG) dan waktu kedaluwarsa.
* **Aturan Relasi (`RESTRICT`):** Penghapusan langsung terhadap record `User` yang masih memiliki sesi aktif akan ditolak oleh PostgreSQL. Penghapusan akun wajib dilakukan melalui transaksi database atomik yang menghapus seluruh `Session` terlebih dahulu.

---

## 4. Matriks Operasi CRUD Lengkap melalui Antarmuka (UI)

Seluruh operasi CRUD pada kedua entitas dapat diakses dan diverifikasi melalui antarmuka pengguna:

| Entitas | Operasi | Aksi / Rute Antarmuka | Server Action & Logika Database |
| :--- | :---: | :--- | :--- |
| **User** | **Create** | Form Pendaftaran di `/auth/signup` | `daftar` ➔ `prisma.user.create()` dengan salt acak dan hash `scrypt`. |
| **User** | **Read** | Form Login di `/auth/login` & Halaman Profil `/settings` | `masuk` & `ambilAkun()` ➔ membaca data publik pengguna (`email`, `uuid`, `createdAt`). |
| **User** | **Update** | Form "Ubah Alamat Email" & "Ubah Kata Sandi" di `/settings` | `perbaruiEmail` & `perbaruiKataSandi` ➔ validasi Zod + verifikasi password lama ➔ `prisma.user.update()`. |
| **User** | **Delete** | Form "Zona Bahaya: Hapus Akun" di `/settings` | `hapusAkunPengguna` ➔ `prisma.$transaction` (menghapus seluruh sesi lalu menghapus akun). |
| **Session** | **Create** | Proses Masuk di `/auth/login` | `buatSesi` ➔ `prisma.session.create()` (token UUIDv4 acak, kedaluwarsa 8 jam, cookie `HttpOnly`). |
| **Session** | **Read** | Guard Rute (`wajibSesi`) & Tabel Sesi di `/settings` | `bacaSesi()` & `ambilDaftarSesi()` ➔ membaca sesi aktif dan seluruh relasi sesi pengguna. |
| **Session** | **Update** | Tombol "↻ Perpanjang Masa Aktif Sesi" di `/settings` | `perpanjangSesiAction` ➔ `prisma.session.update()` memperpanjang `expiresAt` +8 jam dan update cookie. |
| **Session** | **Delete** | Tombol "Keluar" di Header & Tombol "Akhiri" di tabel sesi `/settings` | `keluar` / `akhiriSesiTertentuAction` ➔ `prisma.session.deleteMany()` menghapus sesi dari database. |

---

## 5. Teknologi yang Digunakan

* **Kerangka Kerja Utama:** Next.js 16.3.6 (App Router dengan Server Actions & React Server Components)
* **Pustaka UI & Reaktivitas:** React 19.2.8 (`useActionState`, `useMemo`, `useState`)
* **Bahasa Pemrograman:** TypeScript 5.9.3 (Strict Type Checking)
* **Database & ORM:** PostgreSQL dengan Prisma ORM 7.10.1 (`@prisma/client`, `@prisma/adapter-pg`, `prisma.config.ts`)
* **Validasi Skema:** Zod 4.6.7 (Validasi bentuk masukan, sanitasi string, dan validasi semantik)
* **Tata Letak & Gaya:** Tailwind CSS v4
* **Kriptografi & Keamanan:** Node.js Crypto (`scryptSync`, `randomBytes`, `randomUUID`, `timingSafeEqual`) dan modul referensi Python (`crypto/core_crypto.py` PBKDF2-HMAC-SHA256).

---

## 6. Petunjuk Menjalankan Aplikasi Web & Database

### Prasyarat Sistem
* Node.js v20.x atau lebih baru.
* Database PostgreSQL lokal atau cloud (misal: Supabase / Neon / PostgreSQL Service lokal).
* npm atau yarn.

### Langkah-Langkah Menjalankan:

1. **Clone repositori dan pasang dependensi:**
   ```bash
   git clone https://github.com/danu44-1/Piloty-Comment.git
   cd Piloty-Comment
   npm install
   ```

2. **Konfigurasi Environment Variables:**
   Salin berkas contoh konfigurasi:
   ```bash
   cp .env.example .env
   ```
   Buka berkas `.env` dan sesuaikan URL koneksi database PostgreSQL Anda:
   ```env
   DATABASE_URL="postgresql://postgres:password_anda@localhost:5432/piloty"
   DEMO_EMAIL="demo@piloty.test"
   DEMO_KATA_SANDI="DemoPassword123!"
   ```

3. **Inisialisasi Skema & Migrasi Database Prisma 7:**
   Jalankan migrasi untuk membuat tabel `User` dan `Session` di PostgreSQL:
   ```bash
   npm run db:migrate
   ```
   *(Atau jalankan `npm run db:generate` untuk meregenerasi Prisma Client ke direktori `generated/prisma`).*

4. **Jalankan Seeding Data Sintetis:**
   Masukkan akun demo sintetis dan relasi sesi awal ke database:
   ```bash
   npm run db:seed
   ```
   *Akun demo sintetis default:*  
   * **Email:** `demo@piloty.test`  
   * **Kata Sandi:** `DemoPassword123!`

5. **Mulai Server Pengembangan:**
   ```bash
   npm run dev
   ```
   Buka peramban web pada alamat `http://localhost:3000`.

6. *(Opsional) Inspeksi Database Visual:*
   Untuk membuka antarmuka visual tabel PostgreSQL, jalankan:
   ```bash
   npm run db:studio
   ```

---

## 7. Pengujian & Bukti Pengerjaan

Dokumentasi pengujian lengkap dapat dilihat pada berkas **[`docs/testing/skenario-pengujian-v0.2.md`](file:///c:/Users/dauser/Documents/Kepentingan_Kuliah_sems5/Project_PemWeb_Kriptografi_Keamanan/docs/testing/skenario-pengujian-v0.2.md)**:

* **10 Skenario Pengujian Terverifikasi (Tingkat Kelulusan 100%):**
  * Skenario 1–4: CRUD Entitas `User` (Create, Read, Update, Delete) via UI.
  * Skenario 5–8: CRUD Entitas `Session` (Create, Read, Update, Delete) via UI.
  * Skenario 9–10: Pengujian Relasi Data Multi-Sesi dan Integritas Foreign Key `RESTRICT` dengan Rollback Transaksi.
* **Minimal 3 Bukti Penolakan Validasi Masukan Sisi Server:**
  1. Penolakan format email tidak valid / string kosong (Zod validation per field).
  2. Penolakan kata sandi < 8 karakter & ketidakcocokan konfirmasi (Zod `.refine()`).
  3. Penolakan pendaftaran email duplikat melalui penanganan kode Prisma `P2002` (`hasil_P2002.png`).
  4. Penolakan kata sandi lama yang salah saat memperbarui profil atau menghapus akun.
* **Bukti Visual Tambahan:** Tersedia pada folder `docs/image/img_praktikum/week-6/` (tangkapan layar migrasi psql `RESTRICT`, eksekusi seed idempoten, dan pengujian rollback).

---

## 8. Kriptografi dan Perlindungan Data

### Kebutuhan & Implementasi Kriptografi

| Data yang Dilindungi | Algoritma & Pustaka | Tujuan Keamanan | Implementasi di Produk |
| :--- | :--- | :--- | :--- |
| **Kata Sandi Akun Publisher** | KDF `scrypt` (Node.js) & PBKDF2-HMAC-SHA256 (Python) | Kerahasiaan (*Confidentiality*) & Mitigasi *Rainbow Table/Brute Force* | Kata sandi tidak pernah disimpan dalam *plaintext*. Di web, digunakan `node:crypto.scryptSync` dengan *salt* acak 16 byte (`randomBytes`) dan verifikasi waktu-konstan (`timingSafeEqual`). |
| **Sesi Pengguna / Cookie** | Token Acak CSPRNG (UUIDv4) | Integritas (*Integrity*) & Pencegahan *Session Hijacking* | Token sesi dihasilkan via `node:crypto.randomUUID()`, disimpan di tabel `Session`, dan dikirim ke browser dengan atribut cookie `HttpOnly`, `SameSite: Lax`, dan `Secure`. |
| **Integritas Penghapusan Akun** | Transaksi Atomik Database (`$transaction`) | Konsistensi & Integritas Relasional | Menghapus sesi terlebih dahulu sebelum menghapus akun untuk memenuhi aturan `RESTRICT`, membatalkan seluruh proses (*rollback*) jika salah satu langkah gagal. |

Dokumentasi keamanan lengkap (Inventaris Aset, DFD, Threat Model STRIDE, dan Risk Register) tersedia di direktori **[`security/`](file:///c:/Users/dauser/Documents/Kepentingan_Kuliah_sems5/Project_PemWeb_Kriptografi_Keamanan/security/)**.
