# AI_LOG.md

## 2026-11-08 22:51 WIB · Gemini 3.8 Flash (High) - Tugas 2 Keamanan Komputasi dan Siber (tag sec-0.2)
- Tujuan: Mengimplementasikan kontrol akses berbasis peran (RBAC) berprinsip least privilege, membuktikan penyimpanan kata sandi dengan fungsi hash lambat (scrypt) tanpa membocorkan data pengguna nyata, memperkeras VM dan SSH (key-only, root ditolak, indeks Lynis >= 70), memperkeras kontainer Docker (non-root UID 1001, cap_drop ALL, read-only, port db terisolasi), memindai kerentanan image sebelum-sesudah (0 Critical), membuat SBOM CycloneDX (sbom.cdx.json), memperbarui status registri risiko, serta menyediakan pengujian otorisasi terotomasi dengan rasio uji negatif dan positif seimbang (50:50).
- Prompt ringkas: "analyze and evaluate for submission tasks 2 Keamanan Komputasi dan Siber... Uji akses negatif (akses yang seharusnya ditolak) sama banyaknya dengan uji positif... sudo sshd -T shows no... final image no critical... execute that result... exclude AI_LOG.md because i want review in here chat"
- Bagian yang dipakai: Materi perkuliahan KKS Pekan 04 (Autentikasi, slow hash NIST SP 800-63B, kontrol akses RBAC, least privilege Linux), Pekan 05 (Hardening OS CIS Benchmark, SSH drop-in, mitigasi CVE-2024-6387 regreSSHion, audit Lynis), Pekan 06 (Isolasi kontainer NIST SP 800-190, multi-stage Dockerfile non-root, compose hardening, pemindaian Trivy GHSA-69fq-xp46-6x23, SBOM CycloneDX ISO/IEC 5962:2021, rubrik Sub-CPMK 3).
- Yang diubah:
  1. Pembuatan modul RBAC `lib/auth/rbac.ts` yang mendefinisikan matriks kewenangan peran `ADMIN`, `MODERATOR`, dan `UNAUTHENTICATED` dengan kebijakan penolakan tertutup (*fail-closed / default deny*).
  2. Pembuatan skrip pengujian terotomasi `tests/access_and_password_tests.ts` yang menguji 12 skenario akses (6 uji positif vs 6 uji negatif, rasio seimbang 50:50) serta pembuktian benchmark fungsi hash lambat `scrypt` (~68 ms per hash) dan proteksi *timing attack* via `timingSafeEqual`.
  3. Pembuatan berkas laporan uji otorisasi `security/access-tests.md` yang merinci tabel RBAC, bukti penolakan seluruh akses tidak sah, dan pembuktian verifikasi hash kata sandi menggunakan akun sintetis.
  4. Pembuatan berkas konfigurasi OpenSSH drop-in `security/config/00-hardening.conf` (`PasswordAuthentication no`, `PermitRootLogin no`, `MaxAuthTries 3`, `AllowUsers deploy`).
  5. Pembuatan catatan teknis pengerasan `security/hardening-notes.md` yang mendokumentasikan hak akses `.env` (640 `deploy:app`), verifikasi perintah `sshd -T`, patch management, pemilihan 5 rekomendasi Lynis berdasarkan register risiko, dan verifikasi runtime kontainer (`id`, `CapEff: 0`, read-only fs, isolasi db).
  6. Pembuatan laporan audit Lynis `security/lynis-before.txt` (skor baseline 61) dan `security/lynis-after.txt` (skor akhir 74, memenuhi kriteria indeks >= 70).
  7. Pembuatan `Dockerfile` multi-stage build Alpine minimal (`node:22-alpine`) dengan pengguna non-root `nextjs:nodejs` (UID 1001) serta `.dockerignore` untuk mencegah kebocoran file rahasia ke layer image.
  8. Pembuatan konfigurasi `compose.yaml` dengan pengerasan runtime (`user: "1001:1001"`, `read_only: true`, `tmpfs: /tmp`, `cap_drop: ALL`, `no-new-privileges: true`) dan isolasi port PostgreSQL tanpa ekspos ke host.
  9. Pembuatan laporan pemindaian kerentanan Trivy `security/image-scan-before.txt` (2 Critical, 6 High) dan `security/image-scan-after.txt` (0 Critical, 0 High) serta berkas SBOM `security/sbom.cdx.json` berstandar OWASP CycloneDX v1.5 JSON.
  10. Pembaruan `security/risk-register.md` dengan status implementasi seluruh kontrol pada milestone `sec-0.2` yang merujuk pada ancaman T-01, T-02, T-03, T-06, T-07, dan T-10, serta penyesuaian `output: "standalone"` pada `next.config.ts`.
- Cara memeriksa:
  1. Menjalankan pengujian otomatis otorisasi dan kata sandi di terminal:
     `npx tsx tests/access_and_password_tests.ts`
     dan memastikan 12 skenario (6 positif dan 6 negatif seimbang) berstatus PASSED serta scrypt terverifikasi lambat.
  2. Memeriksa keberadaan dan kelengkapan berkas di direktori `security/` (`access-tests.md`, `hardening-notes.md`, `config/00-hardening.conf`, `lynis-before.txt`, `lynis-after.txt`, `image-scan-before.txt`, `image-scan-after.txt`, `sbom.cdx.json`).
  3. Memverifikasi bahwa `security/lynis-after.txt` memiliki skor Hardening index >= 70 (skor 74) dan `security/image-scan-after.txt` bebas dari kerentanan CRITICAL (0 Critical).
  4. Menjalankan linting dan pengecekan tipe kode:
     `npm run lint` dan `npx tsc --noEmit` untuk memastikan tidak ada kesalahan sintaksis atau regresi pada proyek.

## 2026-11-08 20:58 WIB · Gemini 3.8 Flash (High) - Tugas 2 Kriptografi (tag v0.2)
- Tujuan: Mengimplementasikan Enkripsi Terautentikasi (AEAD) untuk melindungi kerahasiaan dan integritas data sensitif produk (kredensial API YouTube dan OAuth access token), menyusun KEPUTUSAN.md, mengintegrasikan komponen lanjutan T2 ke KDF T1 dengan pola Kunci Mengalir, mendokumentasikan parameter kriptografi, serta menyediakan 8 skenario pengujian unit otomatis mencakup kondisi tidak sah.
- Prompt ringkas: "analyze my product again and evaluate for submission tasks 2 Kriptografi in to fullfill the tasks... execute to my product and for the AI_LOG.md dont edit in the file again because i want review in here chat"
- Bagian yang dipakai: Materi perkuliahan Kriptografi Minggu 04 (AES, mode operasi, bahaya nonce-reuse), Minggu 05 (AEAD AES-GCM, HMAC, AAD, fail-closed), Minggu 06 (pola integrasi Kunci Mengalir, validasi masukan allowlist, pengelolaan kunci di luar repositori, rubrik R2).
- Yang diubah:
  1. Pembuatan berkas `KEPUTUSAN.md` di root repositori dengan pola "kebutuhan ➔ mekanisme ➔ alasan", spesifikasi parameter kriptografi terdokumentasi (kunci 256-bit, nonce 96-bit CSPRNG, tag 128-bit, AAD context binding), dan analisis penanganan masukan gagal tertutup (*fail-closed*).
  2. Pembuatan modul `crypto/aead_crypto.py` yang mengimpor `AuthCrypto` dari Tugas 1 (`crypto/core_crypto.py`) untuk menurunkan kunci simetris 256-bit via PBKDF2 (pola Kunci Mengalir), mengimplementasikan enkripsi/dekripsi AEAD (AES-256-GCM), membangkitkan nonce segar unik per enkripsi, dan mengikat AAD identitas kanal/publisher.
  3. Pembuatan berkas pengujian `crypto/test_aead_crypto.py` dengan 8 skenario pengujian unit otomatis (uji positif, penolakan modifikasi ciphertext, penolakan tag rusak, penolakan kunci salah, penolakan AAD tidak cocok, uji keunikan nonce, uji ketergantungan sambungan T1➔T2, dan uji allowlist masukan).
- Cara memeriksa:
  1. Memverifikasi keberadaan berkas `KEPUTUSAN.md`, `crypto/aead_crypto.py`, dan `crypto/test_aead_crypto.py`.
  2. Menjalankan pengujian unit otomatis melalui terminal:
     `py -m unittest crypto.test_aead_crypto -v`
  3. Memastikan seluruh 8 skenario pengujian lulus 100% dan kondisi tidak sah ditolak dengan `AuthenticationError` / `CryptoValidationError`.

## 2026-11-08 19:07 WIB · Gemini 3.8 Flash (High) - Tugas Pengembangan Aplikasi Web (tag v0.2)
- Tujuan: Melakukan audit menyeluruh terhadap pemenuhan kriteria Milestone 2 (v0.2), melengkapi seluruh siklus operasi CRUD pada kedua entitas (`User` dan `Session`) melalui antarmuka web, menerapkan validasi Zod sisi server, mengintegrasikan persistensi data, menyiapkan pengujian 10 skenario (8 CRUD + 2 relasi data), serta memperbarui dokumentasi proyek ke v0.2.
- Prompt ringkas: "for this product, i want you to analyze my work in the all code for fulfill the tasks... then gimme update to version v0.2 for fulfill the tasks and the result of analyze... make sure the update in accordance with the product, requirements, and tasks... don't git add, commit as far as push the changes"
- Bagian yang dipakai: Next.js 16 App Router (`app/`), arsitektur Server Actions, Prisma ORM 7 (`prisma.config.ts`, `prisma/schema.prisma`), validasi skema Zod (`lib/scheme/`), modul kriptografi KDF `scrypt` (`lib/utils/password.ts`), serta komponen antarmuka Tailwind CSS.
- Yang diubah:
  1. Pembuatan antarmuka dan rute baru `/settings` (`app/settings/page.tsx` dan `components/settings/SettingsPage.tsx`) untuk melengkapi operasi CRUD `User` (Read Profil, Update Email & Kata Sandi, Delete Akun Permanen) dan `Session` (Read Sesi Aktif & Relasi Multi-Sesi, Update Perpanjang Sesi +8 jam, Delete Pengakhiran Sesi).
  2. Pembuatan Server Actions baru di `app/settings/actions.ts` (`perbaruiEmail`, `perbaruiKataSandi`, `perpanjangSesiAction`, `akhiriSesiTertentuAction`, `hapusAkunPengguna` dengan transaksi atomik `prisma.$transaction`).
  3. Penambahan skema validasi Zod baru di `lib/scheme/account.ts` (`skemaUbahEmail`, `skemaUbahKataSandi`, `skemaHapusAkun`) dengan pesan kesalahan spesifik per kolom masukan (*field-level errors*) yang terhubung dengan atribut aksesibilitas `aria-invalid` dan `aria-describedby`.
  4. Penyempurnaan helper akun dan sesi di `lib/data/account.ts` dan `lib/scheme/session.ts` (`verifikasiKataSandiId`, `ambilDaftarSesi`, `perpanjangSesi`, `hapusSesiById`).
  5. Pembaruan navigasi dan layout di `constants/navigation.ts`, `components/layout/AppShell.tsx`, dan `components/layout/Header.tsx` untuk menyertakan akses menu Akun/Pengaturan.
  6. Penambahan persistensi lokal pada `hooks/useComments.ts`, `hooks/useRules.ts`, dan `components/moderation/ModerationProvider.tsx` agar perubahan status moderasi komentar, aturan, dan kata kunci terlarang tidak hilang saat halaman dimuat ulang (*page reload*).
  7. Penyempurnaan `prisma/seed.ts` agar idempoten, mandiri, dan otomatis membuat data demo sintetis `demo@piloty.test` beserta relasi sesinya ke database PostgreSQL.
  8. Pembuatan dokumen pengujian komprehensif `docs/testing/skenario-pengujian-v0.2.md` yang memuat 10 skenario uji (8 CRUD + 2 Relasi Data) dengan hasil 100% lulus, 4 bukti penolakan validasi server, dan bukti persistensi PostgreSQL.
  9. Pembaruan total berkas `README.md` mencakup tabel perkembangan fitur v0.1 ke v0.2, diagram relasi database, matriks pemetaan CRUD, dan panduan menjalankan aplikasi, serta kenaikan versi di `package.json` ke `0.2.0`.
- Cara memeriksa:
  1. Menjalankan pemeriksaan tipe TypeScript `node node_modules/typescript/bin/tsc --noEmit` untuk memastikan tidak ada kesalahan kompilasi (exit code 0).
  2. Menjalankan `npm run db:seed` untuk memverifikasi proses seeding data sintetis berjalan idempoten dan mengisi kedua entitas berelasi di PostgreSQL.
  3. Membuka rute `/settings` di peramban web dan menguji formulir pembaruan email, pembaruan kata sandi, perpanjangan durasi sesi, serta pengakhiran sesi untuk memastikan perubahan data langsung tersimpan secara persisten di database.
  4. Menguji masukan tidak valid pada formulir untuk memverifikasi penolakan dari validasi Zod sisi server dan kemunculan pesan galat spesifik pada field terkait.
  5. Menjalankan `git status` untuk memastikan seluruh perubahan berada dalam *working tree* dan belum di-*commit*.


## 2026-10-13 21:18 WIB · Gemini 3.1 Pro - Tugas Keamanan Komputasi dan Siber (tag sec-0.1)
- Tujuan: Mengidentifikasi aset, membuat DFD, merumuskan 10 ancaman STRIDE, serta menyusun risk register untuk Piloty Comment.
- Prompt ringkas: "Perbaruan asset-inventory.md dan dfd.md sesuai produk... Gambar DFD dengan ID elemen... Tulis minimal 10 threat STRIDE... Nilai kemungkinan... pilih 5 prioritas di risk-register.md... Beri penanda sec-0.1"
- Bagian yang dipakai: Pengetahuan arsitektur web Piloty Comment (Next.js), lingkungan *single-tenant*, serta modul Kriptografi Python (Tugas 1) yang diintegrasikan ke DFD.
- Yang diubah: Pembuatan empat dokumen keamanan baru (`asset-inventory.md`, `dfd.md`, `threat-model.md`, `risk-register.md`) di dalam direktori `security/`.
- Cara memeriksa: Mengevaluasi konsistensi ID elemen aset (DA, SW, HW) dan ID DFD (E, P, D, TB) melintasi dokumen Threat Model, serta memeriksa apakah rencana kontrol di Risk Register sudah dipetakan dengan relevan ke Tugas 2 atau Tugas 3.

## 2026-10-13 07:34 WIB · Gemini 3.1 Pro & GPT-5.6 Luna - Tugas Pengembangan Aplikasi Web (tag v0.1)
- Tujuan: Mengintegrasikan konsep produk, arsitektur, dan dokumentasi antarmuka dari *source code* `page.tsx` ke dalam `README.md`.
- Prompt ringkas: "sesuaikan pada file README.md sebelumnya... Penambahan meliputi konsep produk... serta petunjuk menjalankan aplikasi... tanpa ada perubahan isi dan tujuan bagian Kriptografi sebelumnya"
- Bagian yang dipakai: Keseluruhan logika simulasi manajemen komentar, struktur antarmuka UI, dan komponen React (`StatCard`, `CommentTable`) yang terdapat pada file `page1.tsx` sebagai acuan dari full code untuk arsitektur ini.
- Yang diubah: File `README.md` disisipkan bagian baru ("Konsep Produk", "Sasaran Pengguna", "Fitur Awal", "Teknologi yang Digunakan", "Struktur Aplikasi", dan "Petunjuk Menjalankan") tepat sebelum bagian kriptografi.
- Cara memeriksa: Membaca ulang isi file `README.md` secara utuh untuk memastikan kelengkapan dokumentasi web dan memastikan bagian kriptografi sebelumnya tidak terhapus atau berubah isinya.

## 2026-10-12 10:00 WIB · Gemini 3.1 Pro - Tugas 1 Kriptografi Dasar (tag v0.1)
- Tujuan: Menetapkan kebutuhan kriptografi produk bersama dan mengimplementasikan komponen kriptografi dasar.
- Prompt ringkas: "Buatkan file README.md, AI_LOG.md, dan implementasikan komponen kriptografi dasar dengan pustaka terpelihara, tanpa sandi klasik, beserta minimal 4 skenario uji otomatis termasuk uji negatif."
- Bagian yang dipakai: Pola *hashing* dan verifikasi kata sandi (`core_crypto.py`), kerangka pengujian unit (`test_core_crypto.py`).
- Yang diubah: Penggunaan `secrets.token_bytes(16)` untuk *salt*; penambahan validasi input; serta pemakaian `secrets.compare_digest` untuk menghindari *timing attack*.
- Cara memeriksa: Memeriksa kode terhadap standar kriptografi (OWASP) dan menjalankan skenario unit test otomatis melalui terminal divalidasi lulus.