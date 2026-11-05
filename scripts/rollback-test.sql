-- Uji transaksi & rollback (PostgreSQL). Jalankan: psql "$DATABASE_URL" -f scripts/rollback-test.sql
\echo '=== 0. DATA AWAL ==='
SELECT (SELECT COUNT(*) FROM "User") AS users, (SELECT COUNT(*) FROM "Session") AS sessions;

\echo '=== 1. HAPUS TANPA TRANSAKSI (harus GALAT: RESTRICT) ==='
\set ON_ERROR_STOP off
DELETE FROM "User" WHERE email = 'uji@piloty.test';
\echo '=== 1b. SETELAH GALAT (data harus tetap) ==='
SELECT (SELECT COUNT(*) FROM "User") AS users, (SELECT COUNT(*) FROM "Session") AS sessions;

\echo '=== 2. TRANSAKSI + ROLLBACK ==='
BEGIN;
DELETE FROM "Session" WHERE "userId" = (SELECT id FROM "User" WHERE email = 'uji@piloty.test');
DELETE FROM "User" WHERE email = 'uji@piloty.test';
\echo '--- di dalam transaksi (sebelum ROLLBACK) ---'
SELECT (SELECT COUNT(*) FROM "User") AS users, (SELECT COUNT(*) FROM "Session") AS sessions;
ROLLBACK;
\echo '--- sesudah ROLLBACK (harus sama dengan data awal) ---'
SELECT (SELECT COUNT(*) FROM "User") AS users, (SELECT COUNT(*) FROM "Session") AS sessions;

\echo '=== 3. TRANSAKSI GAGAL DI TENGAH (ROLLBACK otomatis) ==='
BEGIN;
DELETE FROM "Session" WHERE "userId" = (SELECT id FROM "User" WHERE email = 'uji@piloty.test');
DELETE FROM "User" WHERE email = 'uji@piloty.test';  -- sukses
INSERT INTO "User"(email, salt, "passwordHash", uuid, "updatedAt") VALUES (NULL, 'x', 'x', gen_random_uuid()::text, now()); -- GALAT NOT NULL
ROLLBACK;
SELECT (SELECT COUNT(*) FROM "User") AS users, (SELECT COUNT(*) FROM "Session") AS sessions;

\echo '=== 4. HAPUS BENAR: sesi dulu, lalu user, dalam satu transaksi (COMMIT) ==='
BEGIN;
DELETE FROM "Session" WHERE "userId" = (SELECT id FROM "User" WHERE email = 'uji@piloty.test');
DELETE FROM "User" WHERE email = 'uji@piloty.test';
COMMIT;
SELECT (SELECT COUNT(*) FROM "User") AS users, (SELECT COUNT(*) FROM "Session") AS sessions;
