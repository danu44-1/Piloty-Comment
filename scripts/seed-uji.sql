-- Data uji untuk rollback-test.sql (PostgreSQL 13+).
-- Kolom "uuid" tidak punya DEFAULT di database (default Prisma bersifat client-side),
-- jadi harus diisi manual lewat gen_random_uuid().
INSERT INTO "User"(email, salt, "passwordHash", uuid, "updatedAt")
VALUES ('uji@piloty.test', 's', 'h', gen_random_uuid()::text, now())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "Session"("userId", uuid, "expiresAt")
SELECT id, gen_random_uuid()::text, now() + interval '1 day'
FROM "User" WHERE email = 'uji@piloty.test';

INSERT INTO "Session"("userId", uuid, "expiresAt")
SELECT id, gen_random_uuid()::text, now() + interval '2 day'
FROM "User" WHERE email = 'uji@piloty.test';
