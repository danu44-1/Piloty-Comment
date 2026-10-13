# Registri Risiko (Risk Register) & Rencana Kontrol

Berdasarkan *Threat Model* STRIDE, berikut adalah penilaian Likelihood (Kemungkinan) dan Impact (Dampak) untuk memilih 5 risiko keamanan prioritas.

## Penilaian Risiko
*Asumsi produk: Masih dalam tahap pengembangan awal (Tahap 1 & 2), banyak perlindungan sisi server yang belum diimplementasikan.*

| ID Threat | Likelihood | Impact | Level Risiko | Alasan Penilaian Berdasarkan Kondisi Produk |
| :--- | :--- | :--- | :--- | :--- |
| T-01 (Session Hijacking) | Medium | High | **High** | Sesi berbasis Next.js rentan jika belum dikonfigurasi dengan *HttpOnly/Secure cookie*. |
| T-02 (Brute Force) | High | High | **Critical** | Form login publik sering diserang *bot otomatis*. |
| T-03 (SQLi) | Medium | High | **High** | ORM modern biasanya memitigasi ini, tapi query manual berisiko tinggi. |
| T-04 (MitM Payload) | Low | Medium | Low | API resmi YouTube sudah mewajibkan HTTPS/TLS. |
| T-05 (Log Tampering) | Low | Medium | Low | Produk single-tenant; ancaman *insider threat* relatif kecil. |
| T-06 (DB Breach) | Medium | High | **High** | Kredensial curian sangat merusak (meski mitigasi kriptografi PBKDF2 sudah ada, harus divalidasi integrasinya). |
| T-07 (Token Leak) | High | High | **Critical** | Kesalahan `NEXT_PUBLIC_` di React sering terjadi secara tidak sengaja oleh developer. |
| T-08 (DDoS Auth) | Medium | Medium | Medium | Endpoint belum dilindungi *Rate Limiting*. |
| T-09 (DoS via Rules) | Low | Low | Low | Pengguna tunggal cenderung tidak mensabotase aplikasinya sendiri. |
| T-10 (XSS di Dashboard) | High | High | **Critical** | Menampilkan payload komentar audiens secara mentah di UI sangat rentan terhadap *Stored XSS*. |

---

## 5 Risiko Prioritas dan Rencana Kontrol

| Prioritas | Ancaman | Rencana Kontrol Keamanan (Mitigasi) | Peta Tugas |
| :---: | :--- | :--- | :--- |
| **1** | **T-10** (XSS di Dashboard) | **Input & Output Sanitization:** Menerapkan pustaka sanitasi (seperti DOMPurify) dan memastikan React me-render komentar sebagai string teks biasa, bukan HTML (`dangerouslySetInnerHTML` dilarang). | **Tugas 2** (Pengembangan Web) |
| **2** | **T-07** (API Token Leak) | **Secret Management:** Memindahkan semua pemanggilan YouTube API ke rute *server-side* Next.js (Server Actions / Route Handlers) sehingga token kunci tidak pernah dikirim ke SW-01 (Browser). | **Tugas 2** (Pengembangan Web) |
| **3** | **T-02** (Brute Force Login) | **Rate Limiting & Lockout:** Mengimplementasikan batasan percobaan login (maks 5x gagal dalam 15 menit) di middleware P-01 sebelum memanggil modul kriptografi P-02. | **Tugas 3** (Keamanan Siber) |
| **4** | **T-01** (Session Hijacking) | **Secure Cookies:** Memastikan token DA-02 (misal JWT atau session ID) disimpan di cookie dengan *flag* `HttpOnly`, `Secure`, dan `SameSite=Strict`. | **Tugas 3** (Keamanan Siber) |
| **5** | **T-06** (DB Credential Breach) | **Verifikasi Kriptografi Penuh:** Memastikan DA-01 dan DA-03 (Log) sepenuhnya diimplementasikan menggunakan integrasi KDF (AuthCrypto) dari Tugas 1 di lingkungan *production* dan dilindungi *Firewall* database (TB-02). | **Tugas 3** (Keamanan Siber) |