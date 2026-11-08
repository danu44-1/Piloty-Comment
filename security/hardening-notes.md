# Catatan Hardening Sistem Operasi, SSH, dan Kontainer (Hardening Notes)

**Milestone:** `sec-0.2`  
**Mata Kuliah:** Keamanan Komputasi dan Siber (052353)  
**Lingkungan Evaluasi:** Ubuntu Linux 24.04 LTS (VM Lab Environment & Docker Engine 29.5)  
**Tujuan:** Memperkecil *attack surface* sistem operasi dan kontainer secara terukur berdasarkan acuan CIS Benchmark dan NIST SP 800-190.

---

## BAGIAN A: Hak Akses Linux & Least Privilege (VM Lab)

Sesuai materi Pekan 04, hak akses diatur agar tidak ada akses istimewa yang diberikan secara berlebih.

### 1. Akun dan Grup Khusus Aplikasi
Aplikasi dijalankan di bawah akun `deploy` dan grup `app`, terisolasi dari akun personal mahasiswa:
```bash
$ sudo groupadd -g 1001 app
$ sudo useradd -u 1001 -m -s /bin/bash -g app -G app deploy
```

### 2. Audit Akun Superuser
Memastikan hanya akun `root` yang memiliki UID 0 di `/etc/passwd`:
```bash
$ awk -F: '$3 == 0' /etc/passwd
root:x:0:0:root:/root:/bin/bash
```
*Hasil:* Tepat 1 baris (`root`). Tidak ada *backdoor account* dengan UID 0.

### 3. Perlindungan Berkas Rahasia (.env)
Berkas kredensial `.env` di server lab diatur dengan izin `640` dimiliki oleh `deploy:app`:
```bash
$ stat -c "%A %U %G" .env
-rw-r----- deploy app

# Uji Negatif: Pengguna tak berhak mencoba membaca rahasia
$ sudo -u nobody cat .env
cat: .env: Permission denied
```
*Hasil Uji Negatif:* Akses membaca kredensial oleh pihak ketiga tertolak (*Permission denied*).

### 4. Pembatasan Hak Sudo
Konfigurasi `/etc/sudoers.d/deploy` dibatasi hanya untuk perintah manajemen kontainer tertentu tanpa memberikan akses root bebas:
```text
deploy ALL=(ALL) /usr/bin/systemctl restart docker, /usr/bin/docker compose *
```
Verifikasi efektif:
```bash
$ sudo -l -U deploy
User deploy may run the following commands on vm-kks:
    (root) /usr/bin/systemctl restart docker
    (root) /usr/bin/docker compose *
```

---

## BAGIAN B: Hardening OpenSSH Server (Pekan 5)

Sebagai mitigasi ancaman **T-02 (Brute Force SSH)** dan kerentanan **CVE-2024-6387 (regreSSHion)**, konfigurasi OpenSSH diperkeras menggunakan mekanisme *drop-in file*.

### 1. Berkas Konfigurasi Drop-in
Diterapkan pada `/etc/ssh/sshd_config.d/00-hardening.conf` (lihat salinan di [`security/config/00-hardening.conf`](./config/00-hardening.conf)):
* `PermitRootLogin no`
* `PasswordAuthentication no`
* `KbdInteractiveAuthentication no`
* `PubkeyAuthentication yes`
* `AllowUsers deploy`
* `MaxAuthTries 3`
* `LoginGraceTime 30`
* `X11Forwarding no`

### 2. Verifikasi Konfigurasi Efektif (`sshd -T`)
Menguji parameter aktif pada daemon OpenSSH (sshd):
```bash
$ sudo sshd -t && sudo systemctl restart ssh
$ sudo sshd -T | grep -Ei "permitrootlogin|passwordauth|kbdinteractive|allowusers|maxauthtries"
permitrootlogin no
passwordauthentication no
kbdinteractiveauthentication no
allowusers deploy
maxauthtries 3
```
*Kondisi Keberhasilan:* `passwordauthentication` bernilai `no`, `permitrootlogin` bernilai `no`.

### 3. Uji Negatif Akses SSH (Dari Host / Laptop Pengembang)
```bash
# Uji 1: Mencoba login dengan kata sandi (Password Authentication)
$ ssh -o PubkeyAuthentication=no deploy@192.168.56.101
deploy@192.168.56.101: Permission denied (publickey).

# Uji 2: Mencoba login langsung sebagai root
$ ssh root@192.168.56.101
root@192.168.56.101: Permission denied (publickey).
```
*Hasil Uji Negatif:* Seluruh upaya koneksi tanpa *SSH Key* yang sah langsung ditolak oleh server.

---

## BAGIAN C: Patch Management Sistem Operasi

Memastikan sistem operasi selalu menerima pembaruan keamanan otomatis untuk menutup celah *known vulnerabilities*:
```bash
$ sudo apt update && sudo apt upgrade -y
$ cat /etc/apt/apt.conf.d/20auto-upgrades
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";

$ cat /var/run/reboot-required
# (Tidak ada file, menandakan tidak ada reboot tertunda akibat pembaruan kernel)
```

---

## BAGIAN D: Audit Lynis dan Keputusan Perbaikan Berdasarkan Risiko

### 1. Hasil Audit Baseline vs Final
* **Audit Baseline (`security/lynis-before.txt`):** Indeks Keamanan = **61 / 100** (Ditemukan 4 Warning dan 28 Suggestion).
* **Audit Final (`security/lynis-after.txt`):** Indeks Keamanan = **74 / 100** (Target $\ge 70$ tercapai).

### 2. Matriks Keputusan Perbaikan Berdasarkan Register Risiko

| ID Test Lynis | Temuan Audit | Kaitan Risiko Tugas 1 | Keputusan | Tindakan Remediasi / Alasan |
| :--- | :--- | :--- | :---: | :--- |
| **SSH-7408** | SSH daemon mengizinkan autentikasi password & login root | **T-02** (Brute Force) | **Diterapkan** | Diterapkan `00-hardening.conf`: `PasswordAuthentication no` & `PermitRootLogin no`. |
| **AUTH-9262** | Kebijakan password PAM tidak memiliki batas kegagalan percobaan | **T-02** (Brute Force) | **Diterapkan** | Dikonfigurasi `pam_faillock` (deny=5 unlock_time=900) untuk memblokir brute force lokal. |
| **FILE-6310** | Berkas konfigurasi sensitif memiliki izin terlalu longgar (644) | **T-07** (Secrets Leak) | **Diterapkan** | Diterapkan `chmod 640 .env` dan `chmod 700 ~/.ssh`. |
| **BOOT-5122** | Bootloader GRUB tidak dilindungi password | **T-03** (Physical/Escalation) | **Diterapkan** | Menambahkan hash password GRUB pbkdf2 untuk mencegah bypass init single-user mode. |
| **KRNL-5830** | Parameter kernel `sysctl` jaringan belum mengaktifkan proteksi spoofing | **T-04** (MitM / IP Spoofing) | **Diterapkan** | Mengaktifkan `net.ipv4.conf.all.rp_filter = 1` dan `net.ipv4.tcp_syncookies = 1`. |
| **MALW-3280** | Tidak terpasang modul malware scanner (ClamAV) | Risiko Rendah di Lab | **Tidak Diterapkan** | *Residual Risk:* Server hanya menerima input teks komentar terstruktur dari YouTube API, tanpa fitur upload file biner; beban komputasi ClamAV tidak esensial di lingkungan uji. |
| **FILE-6372** | Partisi direktori `/tmp` tidak dipisah dari root `/` | Risiko Rendah di Lab | **Tidak Diterapkan** | *Residual Risk:* Di lingkungan VM praktikum, partisi disk bersifat monolitik virtual; mitigasi dilakukan di level kontainer menggunakan `tmpfs` dan `noexec`. |

---

## BAGIAN E: Hardening Kontainer (Docker & Docker Compose)

Sesuai materi Pekan 06, kontainer diperkeras di level berkas `Dockerfile` dan konfigurasi `compose.yaml`.

### 1. Pembuktian Pengguna Non-Root
Proses aplikasi di dalam kontainer berjalan sebagai user `nextjs` (UID 1001), bukan `root` (UID 0):
```bash
$ docker compose exec app id
uid=1001(nextjs) gid=1001(nodejs) groups=1001(nodejs)
```

### 2. Pembatasan Kernel Capabilities (`CapEff: 0`)
Seluruh Linux capabilities dibuang menggunakan direktif `cap_drop: ALL`:
```bash
$ docker compose exec app grep CapEff /proc/1/status
CapEff: 0000000000000000
```
*Hasil:* CapEff bernilai nol (tidak ada hak istimewa kernel yang dapat dieksploitasi bila aplikasi disusupi).

### 3. Uji Negatif Penulisan Filesystem (`read_only: true`)
Filesystem kontainer dikunci menjadi read-only untuk mencegah injeksi skrip berbahaya atau perubahan kode:
```bash
$ docker compose exec app touch /app/uji
touch: /app/uji: Read-only file system
```
*Hasil Uji Negatif:* Percobaan pembuatan/modifikasi berkas di rootfs langsung digagalkan oleh kernel. Direktori temporer dialihkan ke RAM aman melalui `tmpfs /tmp`.

### 4. Pembuktian Isolasi Jaringan Basis Data (Tanpa Publikasi Port Host)
Layanan PostgreSQL berjalan di jaringan privat internal Docker Compose:
```bash
$ sudo ss -tlpn | grep 5432
# (Keluaran kosong - Port 5432 tidak listening pada antarmuka jaringan host)
```
*Hasil:* Basis data kebal terhadap pemindaian port dan koneksi langsung dari jaringan luar.
