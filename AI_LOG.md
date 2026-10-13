# AI_LOG.md

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