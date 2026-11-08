# Registri Risiko (Risk Register) & Status Kontrol Keamanan

**Milestone:** `sec-0.2` (Tugas 2 Keamanan Komputasi dan Siber)  
**Produk:** Piloty Comment  
**Prinsip Desain:** *Defense-in-Depth*, *Least Privilege*, *CIS Benchmark*, *NIST SP 800-190*

Berdasarkan *Threat Model* STRIDE, berikut adalah penilaian Likelihood (Kemungkinan) dan Impact (Dampak) untuk memilih risiko prioritas dan pelacakan status implementasi kontrolnya.

---

## 1. Penilaian Risiko Keseluruhan

| ID Threat | Kategori STRIDE | Likelihood | Impact | Level Risiko | Deskripsi Risiko |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **T-01** | Spoofing / Elevation | Medium | High | **High** | Session Hijacking & Bypass Otorisasi Sesi pengguna. |
| **T-02** | Spoofing | High | High | **Critical** | Brute Force Login pada form web auth & daemon SSH server. |
| **T-03** | Elevation of Privilege | Medium | High | **High** | Kontainer escape atau penyalahgunaan hak akses root di OS/kontainer. |
| **T-04** | Tampering / MitM | Low | Medium | Low | Intersepsi paket komunikasi YouTube API / traffic jaringan. |
| **T-05** | Repudiation | Low | Medium | Low | Modifikasi log audit aksi moderasi. |
| **T-06** | Information Disclosure | Medium | High | **High** | DB Credential Breach & kebocoran basis data kata sandi. |
| **T-07** | Information Disclosure | High | High | **Critical** | Secrets & API Token Leakage di frontend / image layer Docker. |
| **T-08** | Denial of Service | Medium | Medium | Medium | DDoS / Flood pada endpoint otentikasi. |
| **T-09** | Denial of Service | Low | Low | Low | Sabotase internal penonaktifan aturan filter komentar. |
| **T-10** | Tampering / XSS | High | High | **Critical** | Stored XSS melalui konten payload komentar audiens YouTube. |

---

## 2. Status Kontrol Keamanan Milestone sec-0.2

Berikut adalah pemetaan implementasi kontrol teknis pada rilis `sec-0.2` terhadap register risiko:

| ID Threat | Kontrol Keamanan (Mitigasi) | Mekanisme & Bukti Teknis | Status (`sec-0.2`) |
| :---: | :--- | :--- | :---: |
| **T-01** | **RBAC & Secure Cookies** | Matriks peran (`ADMIN`, `MODERATOR`, `UNAUTHENTICATED`). Cookie bertanda `HttpOnly`, `SameSite: "lax"`, `Secure`. Uji akses 6 positif & 6 negatif seimbang 50:50 pada [`security/access-tests.md`](./access-tests.md). | **TERVERIFIKASI** |
| **T-02** | **SSH Key-Only & Hardening PAM** | OpenSSH drop-in config `00-hardening.conf`: `PasswordAuthentication no`, `PermitRootLogin no`, `MaxAuthTries 3`. Diuji via `sshd -T` pada [`security/hardening-notes.md`](./hardening-notes.md). | **TERVERIFIKASI** |
| **T-03** | **Non-Root & Cap Drop ALL** | Kontainer berjalan sebagai `user: "1001:1001"`, `cap_drop: ALL` (`CapEff: 0`), `security_opt: no-new-privileges:true`, dan `read_only: true` pada [`compose.yaml`](../compose.yaml). | **TERVERIFIKASI** |
| **T-06** | **Slow Hash & DB Network Isolation** | Kata sandi menggunakan `scryptSync` (keylen 64 bytes) + salt CSPRNG 16 bytes. Port database PostgreSQL `5432` tidak dipublikasikan ke host (`compose.yaml` tanpa `ports:`). | **TERVERIFIKASI** |
| **T-07** | **Secret Isolation & Minimal Layers** | Multi-stage Dockerfile (`node:22-alpine` standalone). `.dockerignore` memblokir `.env`. Izin berkas `.env` di VM diset `640` milik `deploy:app`. | **TERVERIFIKASI** |
| **T-10** | **Input Sanitization & Pure Text** | React merender komentar sebagai pure string tanpa `dangerouslySetInnerHTML`. Validasi skema Zod ketat pada setiap masukan form. | **TERVERIFIKASI** |

---

## 3. Hasil Audit dan Pemindaian Kerentanan

1. **Audit Lynis:**
   - *Baseline Index (`lynis-before.txt`):* **61 / 100**
   - *Final Hardened Index (`lynis-after.txt`):* **74 / 100** ($\ge 70$, Memenuhi Ketentuan).
2. **Pemindaian Kerentanan Kontainer (Trivy):**
   - *Baseline Scan (`image-scan-before.txt`):* 2 Critical, 6 High.
   - *Final Hardened Scan (`image-scan-after.txt`):* **0 Critical, 0 High** (Bebas kerentanan kritis).
3. **Software Bill of Materials (SBOM):**
   - Berkas [`security/sbom.cdx.json`](./sbom.cdx.json) dalam format standar OWASP CycloneDX v1.5 JSON.
