# Inventaris Aset (Asset Inventory) - Piloty Comment

Dokumen ini mencatat seluruh aset yang terlibat dalam operasional Piloty Comment. Aset diklasifikasikan menjadi Data (DA), Software (SW), dan Hardware (HW).

| ID Aset | Nama Aset | Tipe | Deskripsi & Status Perlindungan |
| :--- | :--- | :--- | :--- |
| **DA-01** | Kredensial Pengguna (Kata Sandi) | Data | Kata sandi milik Publisher/YouTuber untuk masuk ke dashboard. **(Dilindungi Kriptografi: Hashing PBKDF2)** |
| **DA-02** | Sesi/Cookie Autentikasi | Data | Token atau cookie yang membuktikan bahwa pengguna telah berhasil login dan memiliki sesi aktif. |
| **DA-03** | Audit Log (Catatan Aktivitas) | Data | Log yang merekam aktivitas penting seperti login dan pengubahan aturan moderasi. **(Dilindungi Kriptografi: Rantai Hash / Hash Chain)** |
| **DA-04** | Data Komentar YouTube | Data | Payload komentar audiens yang ditarik dari YouTube API (berisi nama, avatar, isi komentar, dan waktu). |
| **DA-05** | Aturan Moderasi (Rules) | Data | Konfigurasi kata kunci terlarang (blocked keywords) dan status toggle fitur moderasi spam/link. |
| **SW-01** | Frontend Next.js | Software | Aplikasi web antarmuka pengguna, berjalan dengan React, Tailwind CSS, dan melayani rute dashboard. |
| **SW-02** | Modul Kriptografi Python | Software | Skrip backend (core_crypto.py) yang memproses KDF dan verifikasi hash kata sandi. |
| **HW-01** | Server Aplikasi | Hardware | Infrastruktur (VPS/Cloud) tempat Next.js dan backend Python berjalan. |
| **HW-02** | Server Database | Hardware | Infrastruktur penyimpanan persisten tempat data (DA-01 hingga DA-05) disimpan dengan aman. |