# Infrastructure — PilotyComment

> **Model yang digunakan dalam percakapan ini:** GPT-5.6 Luna  
> **Produk:** PilotyComment — YouTube Comment Moderation Dashboard  
> **Versi produk:** v0.1  
> **Tujuan dokumen:** Menjelaskan bagaimana aplikasi dijalankan saat ini, gambaran arsitektur infrastrukturnya, serta arah pengembangan berikutnya menuju autentikasi, database, history/audit log, keamanan sesi, dan integrasi YouTube API.

---

## 1. Gambaran Umum

PilotyComment saat ini merupakan aplikasi Next.js yang masih berada pada tahap **v0.1**.

Fokus utama versi ini adalah membangun dan merapikan:

- struktur frontend
- halaman Dashboard
- halaman Comments
- halaman Rules
- komponen UI
- state management
- logika moderasi
- mock/demo data

Pada tahap v0.1, sistem belum perlu dipaksakan menjadi platform produksi penuh.

Arsitektur saat ini dapat digambarkan sebagai:

```text
PilotyComment v0.1
│
├── Overview
├── Comments
└── Rules
     │
     ▼
ModerationProvider
     │
     ▼
Moderation Logic
     │
     ▼
Mock / Demo Data
```

Arah pengembangan berikutnya adalah:

```text
Frontend v0.1
     │
     ▼
Database
     │
     ▼
Authentication
     │
     ▼
Session & Authorization
     │
     ▼
History / Audit Log
     │
     ▼
YouTube OAuth
     │
     ▼
YouTube API
     │
     ▼
Real Comment Moderation
```

---

# 2. Status Infrastructure Saat Ini

Pada versi **v0.1**, beberapa bagian masih berupa prototype.

| Bagian | Status v0.1 |
|---|---|
| Next.js App Router | Sudah |
| React | Sudah |
| TypeScript | Sudah |
| Tailwind CSS | Sudah |
| Dashboard | Sudah |
| Comments | Sudah |
| Rules | Sudah |
| Moderation logic | Sudah |
| Mock data | Masih digunakan |
| Database | Belum |
| Authentication | Belum |
| Session management | Belum |
| History / Audit Log | Belum |
| YouTube API | Belum |
| Production security | Belum |
| Cryptography | **Sudah pernah diuji / dieksplorasi, tetapi belum diorganisasi ke dalam arsitektur v0.1** |

### Catatan penting tentang cryptography

Cryptography **sudah pernah diuji untuk kebutuhan eksperimen/prototyping**, tetapi pada tahap produk **v0.1 belum akan dimasukkan sebagai bagian infrastructure utama**.

Dengan demikian:

```text
Cryptography
     │
     ├── sudah pernah diuji
     │
     └── belum diintegrasikan ke architecture v0.1
```

Keputusan ini disengaja agar versi v0.1 tetap fokus pada fondasi produk dan struktur aplikasi.

Cryptography akan diorganisasi kembali ketika kebutuhan autentikasi, session, OAuth token, dan penyimpanan data sensitif sudah benar-benar masuk ke implementasi produk.

---

# 3. Cara Aplikasi Saat Ini Berjalan

## 3.1 Development

Alur pengembangan saat ini:

```text
Developer
   │
   ▼
Project PilotyComment
   │
   ├── npm install
   │
   ├── npm run dev
   │
   ▼
Next.js Development Server
   │
   ▼
http://localhost:3000
```

Aplikasi kemudian dirender melalui Next.js App Router.

Struktur route saat ini:

```text
/
├── Dashboard
│
├── /comments
│   └── Comments
│
└── /rules
    └── Rules
```

---

# 4. Arsitektur Aplikasi v0.1

Struktur yang telah dibangun:

```text
PilotyComment/
│
├── app/
│   ├── page.tsx
│   ├── comments/
│   ├── rules/
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── comments/
│   ├── moderation/
│   ├── rules/
│   └── ui/
│
├── hooks/
│   ├── useComments.ts
│   ├── useRules.ts
│   ├── useModeration.ts
│   └── useToast.ts
│
├── lib/
│   ├── types/
│   ├── data/
│   ├── moderation/
│   ├── utils/
│   └── validation.ts
│
└── constants/
```

Pembagian tanggung jawabnya:

```text
app/
    → route dan entry point

components/
    → tampilan dan UI

hooks/
    → state dan interaksi React

lib/types/
    → tipe data

lib/data/
    → mock/demo data

lib/moderation/
    → business logic moderasi

lib/utils/
    → fungsi utilitas

constants/
    → konfigurasi tetap
```

Tujuannya adalah agar `app/page.tsx` tidak menjadi tempat seluruh kode aplikasi.

---

# 5. Prinsip Infrastruktur Berikutnya

Ketika aplikasi berkembang, dependency sebaiknya bergerak seperti:

```text
UI
 ↓
Hooks / Client State
 ↓
Application API
 ↓
Services
 ↓
Database / External API
```

Bukan:

```text
UI
 ├── Database
 ├── Authentication
 ├── Password
 ├── YouTube API
 └── Business Logic
```

Dengan demikian, komponen frontend tetap fokus terhadap tampilan dan interaksi pengguna.

---

# 6. Target Struktur Infrastructure

Setelah mulai masuk backend dan autentikasi, struktur dapat berkembang menjadi:

```text
PilotyComment/
│
├── app/
│   ├── page.tsx
│   ├── comments/
│   ├── rules/
│   ├── login/
│   ├── register/
│   ├── settings/
│   └── api/
│       ├── auth/
│       ├── comments/
│       ├── rules/
│       ├── youtube/
│       └── audit/
│
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── comments/
│   ├── moderation/
│   ├── rules/
│   ├── auth/
│   └── ui/
│
├── hooks/
│   ├── useAuth.ts
│   ├── useComments.ts
│   ├── useRules.ts
│   ├── useModeration.ts
│   └── useYouTube.ts
│
├── lib/
│   ├── types/
│   ├── data/
│   ├── moderation/
│   └── utils/
│
├── auth/
│   ├── session.ts
│   ├── password.ts
│   ├── permissions.ts
│   └── guards.ts
│
├── services/
│   ├── youtube/
│   │   ├── youtubeClient.ts
│   │   ├── channels.ts
│   │   ├── videos.ts
│   │   └── comments.ts
│   ├── moderation/
│   └── users/
│
├── database/
│   ├── client.ts
│   ├── schema/
│   └── repositories/
│
├── security/
│   └── rateLimit.ts
│
├── audit/
│   ├── auditLog.ts
│   └── auditTypes.ts
│
└── constants/
```

### Catatan v0.1

Folder berikut **belum perlu dibuat hanya untuk mengikuti diagram**:

```text
auth/
database/
services/youtube/
audit/
```

Folder tersebut menjadi struktur target ketika fiturnya mulai benar-benar dikerjakan.

Hal yang sama berlaku untuk cryptography.

Tidak perlu memasukkan:

```text
security/crypto.ts
```

ke v0.1 hanya karena arsitektur masa depan membutuhkannya.

---

# 7. Authentication

Authentication akan menjadi tahap berikutnya setelah fondasi frontend v0.1 stabil.

Tujuan authentication adalah menjawab:

> "Siapa pengguna yang sedang menggunakan PilotyComment?"

Alur:

```text
User
 │
 ▼
Login
 │
 ├── email
 └── password
 │
 ▼
Authentication Service
 │
 ├── cari user
 ├── verifikasi password
 └── buat session
 │
 ▼
Session
 │
 ▼
Dashboard
```

Authentication berbeda dengan authorization.

```text
Authentication
= Siapa pengguna?

Authorization
= Apa yang boleh dilakukan pengguna?
```

---

# 8. Rencana Folder `auth/`

Ketika authentication mulai dikerjakan:

```text
auth/
├── session.ts
├── password.ts
├── permissions.ts
├── guards.ts
└── types.ts
```

### `session.ts`

Menangani:

- membuat session
- membaca session
- memvalidasi session
- mengakhiri session
- expiration session

### `password.ts`

Menangani:

- password hashing
- password verification
- password change
- password reset pada tahap berikutnya

### `permissions.ts`

Menentukan hak pengguna.

### `guards.ts`

Melindungi halaman atau API yang membutuhkan authentication.

---

# 9. Password

Password tidak boleh disimpan sebagai plaintext.

Alur yang benar:

```text
Password User
      │
      ▼
Password Hashing
      │
      ▼
Password Hash
      │
      ▼
Database
```

Ketika login:

```text
Password dari User
      │
      ▼
Password Verification
      │
      ▼
Password Hash di Database
      │
      ├── cocok → Login berhasil
      │
      └── tidak cocok → Login ditolak
```

Untuk implementasi nyata, gunakan algoritma password hashing yang memang dirancang untuk password, misalnya **Argon2id** atau implementasi password hashing terpercaya lainnya.

Jangan menggunakan hash umum seperti SHA-256 secara langsung untuk penyimpanan password.

---

# 10. Session

Session digunakan agar pengguna tidak harus login ulang pada setiap request.

Konsep:

```text
Login
 │
 ▼
Create Session
 │
 ▼
Session ID
 │
 ▼
Secure Cookie
 │
 ▼
Browser
```

Request berikutnya:

```text
Browser
 │
 ▼
Session Cookie
 │
 ▼
Server
 │
 ▼
Validate Session
 │
 ▼
Current User
```

Session harus mempunyai expiration dan mekanisme revoke/logout.

Untuk production, cookie session sebaiknya menggunakan pengaturan keamanan yang sesuai, seperti:

```text
HttpOnly
Secure
SameSite
Expiration
```

---

# 11. Cryptography pada v0.1

Cryptography **tidak menjadi prioritas infrastructure pada saat ini**.

Statusnya:

```text
Cryptography
      │
      ├── sudah pernah diuji
      │
      ├── sudah menjadi pengetahuan/eksperimen teknis
      │
      └── belum diorganisasi ke product architecture
```

Alasan:

PilotyComment masih berada pada **v0.1**, sehingga fokus saat ini adalah:

```text
UI
+
Architecture
+
Moderation Flow
+
Product Structure
```

bukan:

```text
Production-grade Security Infrastructure
```

Cryptography baru akan menjadi bagian infrastructure ketika kebutuhan nyata muncul, misalnya:

```text
Password
     │
     ▼
Password Hashing

YouTube OAuth Token
     │
     ▼
Encryption at Rest

Session
     │
     ▼
Secure Random Session Identifier
```

Jadi untuk sekarang:

> **Cryptography tetap dianggap sebagai hasil eksperimen/prototyping dan tidak perlu diorganisasi lebih lanjut ke struktur v0.1.**

---

# 12. Database

Mock data pada v0.1 nantinya akan digantikan database.

Hubungan data secara konseptual:

```text
User
 │
 ├── Session
 ├── YouTube Account
 ├── Comment
 ├── Moderation Rule
 └── Audit Log
```

Contoh struktur:

```text
users
├── id
├── email
├── password_hash
├── name
├── created_at
└── updated_at

sessions
├── id
├── user_id
├── expires_at
├── created_at
└── revoked_at

youtube_accounts
├── id
├── user_id
├── youtube_channel_id
├── access_token
├── refresh_token
├── expires_at
└── created_at

comments
├── id
├── youtube_comment_id
├── user_id
├── author_name
├── content
├── status
├── reason
├── created_at
└── updated_at

moderation_rules
├── id
├── user_id
├── type
├── value
├── enabled
├── created_at
└── updated_at

audit_logs
├── id
├── user_id
├── action
├── entity_type
├── entity_id
├── metadata
└── created_at
```

Ini masih merupakan **rancangan konseptual**, bukan schema final.

---

# 13. History dan Audit Log

History yang sebelumnya masih berada pada konsep UI nantinya dapat menjadi audit log nyata.

Contoh:

```text
User
 │
 ▼
Block Comment
 │
 ▼
Comment Service
 │
 ├── update comment
 │
 └── create audit log
          │
          ▼
      audit_logs
```

Contoh event:

```json
{
  "action": "COMMENT_BLOCKED",
  "entityType": "comment",
  "entityId": "comment_123",
  "userId": "user_456"
}
```

Event yang dapat dicatat:

```text
LOGIN
LOGOUT
COMMENT_BLOCKED
COMMENT_ALLOWED
COMMENT_REVIEWED
RULE_CREATED
RULE_UPDATED
RULE_DELETED
KEYWORD_ADDED
KEYWORD_REMOVED
YOUTUBE_CONNECTED
YOUTUBE_DISCONNECTED
SETTINGS_UPDATED
```

Audit log sebaiknya bersifat append-oriented.

Artinya:

```text
Create log
   ↓
Simpan
   ↓
Jangan diubah sembarangan
```

---

# 14. YouTube API

YouTube API akan menjadi tahap integrasi setelah authentication dan database sudah memiliki fondasi yang jelas.

Jangan membuat:

```text
Browser
   │
   ▼
YouTube API
```

Sebagai gantinya:

```text
Browser
   │
   ▼
PilotyComment Server
   │
   ▼
YouTube Service
   │
   ▼
YouTube API
```

Keuntungannya:

- credential tetap di server
- authorization dapat diperiksa
- request dapat divalidasi
- error dapat dikontrol
- quota dapat dikontrol
- data dapat disimpan ke database

---

# 15. YouTube OAuth

Untuk menghubungkan akun YouTube pengguna, gunakan OAuth sesuai kebutuhan API.

Alur:

```text
User
 │
 ▼
Connect YouTube
 │
 ▼
YouTube Authorization
 │
 ▼
User memberikan izin
 │
 ▼
Callback ke PilotyComment
 │
 ▼
Server
 │
 ├── validasi callback
 ├── proses authorization code
 ├── mendapatkan token
 └── simpan koneksi
 │
 ▼
YouTube Connected
```

Scope OAuth harus dibuat seminimal mungkin sesuai fitur yang benar-benar dibutuhkan.

---

# 16. YouTube Service

Struktur target:

```text
services/
└── youtube/
    ├── youtubeClient.ts
    ├── channels.ts
    ├── videos.ts
    ├── comments.ts
    └── types.ts
```

Tanggung jawab:

### `youtubeClient.ts`

Menangani komunikasi dasar dengan YouTube API.

### `channels.ts`

Menangani data channel.

### `videos.ts`

Menangani data video.

### `comments.ts`

Menangani:

- mengambil komentar
- mengambil comment thread
- sinkronisasi komentar
- aksi moderasi yang didukung API

---

# 17. Application API

Ketika backend mulai dibuat, frontend tidak langsung berbicara dengan database.

Contoh:

```text
CommentsPage
     │
     ▼
Application API
     │
     ▼
Comment Service
     │
     ├── Database
     │
     └── YouTube Service
```

Contoh endpoint:

```text
/api/auth/login
/api/auth/logout
/api/auth/session

/api/comments
/api/comments/[id]

/api/rules
/api/rules/[id]

/api/youtube/connect
/api/youtube/callback
/api/youtube/channel
/api/youtube/videos
/api/youtube/comments

/api/audit
```

API route sebaiknya hanya menjadi boundary.

Business logic berada di service.

```text
API Route
   │
   ▼
Service
   │
   ▼
Repository / External API
```

---

# 18. Request Pipeline

Request yang membutuhkan authentication sebaiknya melewati:

```text
HTTP Request
     │
     ▼
Authentication
     │
     ├── gagal → 401
     │
     ▼
Authorization
     │
     ├── tidak boleh → 403
     │
     ▼
Validation
     │
     ├── invalid → 400 / 422
     │
     ▼
Application Service
     │
     ▼
Database / YouTube API
     │
     ▼
Audit Log
     │
     ▼
HTTP Response
```

Ini menjadi security boundary aplikasi.

---

# 19. Moderation Setelah Terhubung YouTube

Moderation engine yang sekarang menggunakan mock data dapat berkembang menjadi:

```text
YouTube Comments
       │
       ▼
Synchronization Service
       │
       ▼
Database
       │
       ▼
Moderation Engine
       │
       ├── Spam
       ├── Suspicious Link
       ├── Blocked Keyword
       └── Manual Review
       │
       ▼
Decision
       │
       ├── Allowed
       ├── Pending
       └── Blocked
       │
       ▼
Audit Log
```

Dengan model ini, UI yang sekarang sudah dibuat masih dapat digunakan.

Yang berubah terutama adalah sumber datanya:

```text
v0.1

Mock Data
   ↓
Moderation
   ↓
UI
```

menjadi:

```text
YouTube
   ↓
Database
   ↓
Moderation
   ↓
UI
```

---

# 20. Environment Variables

Ketika backend mulai dibuat, environment variable dapat menggunakan pola:

```env
# Application
NEXT_PUBLIC_APP_URL=
NODE_ENV=

# Database
DATABASE_URL=

# Authentication
SESSION_SECRET=

# YouTube OAuth
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_REDIRECT_URI=
```

Untuk v0.1, tidak semua variable tersebut harus sudah tersedia.

Yang penting adalah membedakan:

```text
Public Configuration
        vs
Private Secret
```

Variable dengan:

```text
NEXT_PUBLIC_
```

dapat diekspos ke browser.

Secret seperti:

```text
DATABASE_URL
SESSION_SECRET
YOUTUBE_CLIENT_SECRET
```

harus tetap server-side.

---

# 21. Secret Management

Development:

```text
.env.local
```

Production:

```text
Secret Manager / Deployment Environment
              │
              ▼
        Server Runtime
```

Jangan commit:

```text
.env
.env.local
credentials.json
private keys
OAuth secrets
database passwords
```

Gunakan:

```text
.env.example
```

sebagai template.

Contoh:

```env
DATABASE_URL=
SESSION_SECRET=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_REDIRECT_URI=
```

---

# 22. Authorization

Authentication menjawab siapa pengguna.

Authorization menentukan apa yang boleh dilakukan pengguna.

Untuk versi awal:

```text
User
 ├── melihat komentar
 ├── moderasi komentar
 ├── mengatur rules
 ├── menghubungkan YouTube
 └── melihat history
```

Jika nantinya menjadi platform multi-user/team:

```text
Organization
 │
 ├── Owner
 ├── Admin
 ├── Moderator
 └── Viewer
```

Contoh:

```text
Moderator
   │
   ├── read comments
   ├── block comments
   └── allow comments

Moderator
   └── tidak dapat mengelola anggota
```

Authorization tidak perlu dibuat kompleks sebelum kebutuhan tersebut benar-benar muncul.

---

# 23. Error Handling

API nantinya dapat menggunakan standar:

| Status | Arti |
|---|---|
| 400 | Request tidak valid |
| 401 | Belum terautentikasi |
| 403 | Tidak memiliki izin |
| 404 | Resource tidak ditemukan |
| 409 | Konflik data |
| 422 | Validasi gagal |
| 429 | Terlalu banyak request |
| 500 | Kesalahan server |
| 502/503 | Service eksternal bermasalah |

Frontend kemudian menerjemahkan error tersebut menjadi pesan yang dapat dimengerti pengguna.

---

# 24. Rate Limiting

Rate limiting belum menjadi fokus utama v0.1.

Namun, ketika authentication dan YouTube API sudah aktif, rate limiting penting terutama untuk:

```text
/api/auth/login
/api/auth/register
/api/auth/password-reset
/api/youtube/*
```

Tujuannya:

- mengurangi brute-force login
- mencegah request berlebihan
- menjaga resource server
- mengurangi penggunaan quota YouTube

---

# 25. YouTube API Quota

YouTube API memiliki mekanisme quota.

Karena itu, jangan melakukan:

```text
Setiap render UI
       │
       ▼
YouTube API
```

Lebih baik:

```text
YouTube
   │
   ▼
Synchronization
   │
   ▼
Database
   │
   ▼
Dashboard
```

Dengan demikian, database menjadi sumber data aplikasi untuk kebutuhan UI sehari-hari.

YouTube menjadi external source.

---

# 26. Target Infrastructure Diagram

Arsitektur target:

```text
                         ┌──────────────────┐
                         │      Browser     │
                         └────────┬─────────┘
                                  │ HTTPS
                                  ▼
                    ┌──────────────────────────┐
                    │       Next.js App        │
                    │                          │
                    │  App Router / UI / API  │
                    └────────────┬─────────────┘
                                 │
             ┌───────────────────┼────────────────────┐
             │                   │                    │
             ▼                   ▼                    ▼
       Authentication       Application          YouTube
             │                Services              API
             │                   │                    │
             ▼                   ▼                    ▼
        Sessions             Database             YouTube
        Passwords               │                 Account
        Permissions             │
                                ▼
                           Audit Logs

                 Security Layer
                 ┌─────────────┐
                 │ Validation  │
                 │ Secrets     │
                 │ Rate Limit  │
                 │ Crypto*     │
                 └─────────────┘

* Crypto belum menjadi bagian utama v0.1.
```

---

# 27. Roadmap Infrastructure

Tidak semua infrastructure perlu dibuat sekarang.

Urutan yang direkomendasikan:

## Phase 1 — v0.1

**Fokus saat ini**

```text
Next.js
React
Tailwind
Component Architecture
Hooks
Moderation Logic
Mock Data
Dashboard
Comments
Rules
```

Target:

```text
Frontend prototype yang rapi dan stabil
```

---

## Phase 2 — Database

Berikutnya:

```text
database/
```

Implementasi:

- database connection
- schema
- users
- comments
- rules
- sessions
- audit logs

Target:

```text
Mock Data
    ↓
Persistent Data
```

---

## Phase 3 — Authentication

Kemudian:

```text
auth/
```

Implementasi:

- register
- login
- logout
- password hashing
- session
- protected pages
- authorization

Target:

```text
Demo User
    ↓
Real User
```

---

## Phase 4 — History / Audit

Kemudian:

```text
audit/
```

Implementasi:

- login history
- moderation history
- rule changes
- YouTube connection history
- user actions

Target:

```text
User Action
    ↓
Persistent History
```

---

## Phase 5 — YouTube Integration

Kemudian:

```text
services/youtube/
```

Implementasi:

- OAuth
- channel
- video
- comments
- synchronization
- moderation integration

Target:

```text
Mock Comments
      ↓
Real YouTube Comments
```

---

## Phase 6 — Security Hardening

Setelah fitur utama bekerja:

```text
Rate Limiting
Secret Management
Secure Cookies
Validation
Security Headers
Monitoring
Error Tracking
```

Cryptography juga dapat diorganisasi pada tahap ini apabila memang sudah dibutuhkan oleh fitur nyata.

---

# 28. Target Final Architecture

```text
PilotyComment
│
├── app/
│   ├── public pages
│   ├── authenticated pages
│   └── api/
│
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── comments/
│   ├── rules/
│   ├── moderation/
│   └── auth/
│
├── hooks/
│   ├── useAuth
│   ├── useComments
│   ├── useRules
│   └── useYouTube
│
├── auth/
│   ├── session
│   ├── password
│   ├── permissions
│   └── guards
│
├── services/
│   ├── youtube
│   ├── moderation
│   └── users
│
├── database/
│   ├── client
│   ├── schema
│   └── repositories
│
├── security/
│   └── rateLimit
│
├── audit/
│   ├── auditLog
│   └── auditTypes
│
├── lib/
│   ├── types
│   ├── moderation
│   └── utils
│
└── constants/
```

`security/crypto` sengaja tidak dimasukkan sebagai kebutuhan wajib v0.1 karena cryptography sudah pernah diuji tetapi belum menjadi bagian product architecture saat ini.

---

# 29. Hubungan Dengan Architecture yang Sekarang

Architecture yang sudah dibuat tidak perlu dibuang.

Saat ini:

```text
Dashboard
   │
   ▼
ModerationProvider
   │
   ▼
Moderation Logic
   │
   ▼
Mock Data
```

Nantinya:

```text
Dashboard
   │
   ▼
ModerationProvider / Hooks
   │
   ▼
Application API
   │
   ▼
Moderation Service
   │
   ├── Database
   │
   └── YouTube Service
            │
            ▼
       YouTube API
```

Dengan demikian:

> **Frontend v0.1 menjadi fondasi UI, sedangkan infrastructure berikutnya dapat ditambahkan secara bertahap tanpa mengulang architecture frontend dari awal.**

---

# 30. Prioritas Pengembangan Saat Ini

Karena produk masih **v0.1**, prioritasnya adalah:

```text
1. Stabilkan frontend architecture
        ↓
2. Pastikan workflow moderation jelas
        ↓
3. Tentukan model data
        ↓
4. Tambahkan database
        ↓
5. Tambahkan authentication
        ↓
6. Tambahkan session & authorization
        ↓
7. Tambahkan history / audit
        ↓
8. Integrasikan YouTube OAuth
        ↓
9. Integrasikan YouTube API
        ↓
10. Security hardening
```

Bukan:

```text
v0.1
 ↓
langsung membuat semua security infrastructure
 ↓
langsung membuat seluruh YouTube integration
```

Pendekatan bertahap akan membuat pengembangan lebih mudah diuji dan dipelihara.

---

# 31. Kesimpulan

PilotyComment saat ini berada pada tahap **v0.1**, sehingga infrastructure yang ada memang masih berfokus pada frontend dan prototype moderation.

Arsitektur saat ini sudah memisahkan:

```text
Routes
Components
Hooks
Business Logic
Mock Data
Utilities
```

Tahap berikutnya adalah membangun fondasi backend:

```text
Database
   ↓
Authentication
   ↓
Session
   ↓
Authorization
   ↓
History / Audit
   ↓
YouTube OAuth
   ↓
YouTube API
```

Cryptography **sudah pernah diuji**, tetapi **belum perlu diorganisasi ke dalam product architecture v0.1**. Cryptography akan dimasukkan ketika kebutuhan seperti password hashing, secure session, atau penyimpanan token OAuth benar-benar mulai diimplementasikan.

Dengan pendekatan tersebut, PilotyComment dapat berkembang secara bertahap:

```text
v0.1
Frontend Prototype
      ↓
v0.2
Persistent Data + Authentication
      ↓
v0.3
YouTube Integration
      ↓
v0.x
Moderation Platform
      ↓
Production
```

Tujuan akhirnya adalah:

```text
                    PilotyComment
                         │
                         ▼
               Authenticated User
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       Comments         Rules        Dashboard
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                  Moderation Engine
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
          Database              YouTube API
              │                     │
              └──────────┬──────────┘
                         ▼
                  History / Audit
```

**Prinsip utama v0.1:** jangan membangun infrastructure yang belum dibutuhkan. Bangun fondasi yang rapi, lalu tambahkan authentication, database, audit, dan YouTube integration ketika masing-masing fitur mulai masuk ke product.
