# Pemodelan Ancaman (Threat Model) - STRIDE

Pemodelan ini mengidentifikasi ancaman keamanan pada arsitektur Piloty Comment berdasarkan metodologi STRIDE.

| ID | Elemen DFD | Kategori STRIDE | Skenario Ancaman | Aset Terdampak |
| :--- | :--- | :--- | :--- | :--- |
| **T-01** | E-01 → P-01 | **S**poofing | Penyerang membajak *cookie/session* (DA-02) yang tidak aman saat transit di TB-01, lalu berpura-pura menjadi Publisher. | DA-02 (Sesi) |
| **T-02** | E-01 → P-02 | **S**poofing | Penyerang mencoba *Credential Stuffing* (brute-force) pada endpoint login untuk mendapatkan akses. | DA-01 (Kredensial) |
| **T-03** | P-01 → D-01 | **T**ampering | Penyerang dengan eksploitasi *SQL Injection* mengubah Aturan Moderasi langsung di database melalui input pencarian. | DA-05 (Aturan) |
| **T-04** | E-02 → P-01 | **T**ampering | Data komentar yang ditarik (DA-04) dicegat dan dimodifikasi (*Man-in-the-Middle*) sebelum mencapai server karena kurangnya enkripsi komunikasi (TLS). | DA-04 (Komentar) |
| **T-05** | P-03 → D-01 | **R**epudiation | Seseorang menghapus/mengubah log sistem secara diam-diam sehingga aktivitas perubahan *rules* tidak dapat dibuktikan. | DA-03 (Audit Log 🔒) |
| **T-06** | D-01 | **I**nformation Disclosure | Penyerang berhasil membobol TB-02 (Database) dan mencuri tabel kata sandi. (Catatan: Dampak dimitigasi jika DA-01 di-hash dengan benar). | DA-01 (Kredensial 🔒) |
| **T-07** | E-02 → P-01 | **I**nformation Disclosure | Token rahasia YouTube API terekspos di sisi klien (browser) pada SW-01 Next.js karena salah menempatkan environment variable. | SW-01, DA-04 |
| **T-08** | P-01 (TB-01) | **D**enial of Service | Botnet mengirimkan ribuan *request* secara terus-menerus ke endpoint login/scan (P-03), menyebabkan server (HW-01) kehabisan sumber daya (CPU/RAM). | HW-01 (Server App) |
| **T-09** | P-03 → D-01 | **D**enial of Service | Penyerang menambahkan ribuan "Blocked keywords" raksasa secara berulang, melambatkan atau merusak proses pemindaian *Moderation Engine*. | DA-05, HW-02 |
| **T-10** | E-02 → P-01 | **E**levation of Privilege | *Cross-Site Scripting* (XSS): Penyerang memasukkan skrip berbahaya lewat komentar YouTube, yang tereksekusi di browser Publisher saat membuka dashboard. | SW-01, DA-02 |