-- Keep the existing User and Session records while changing internal numeric
-- primary keys and adding varchar UUIDs for application-facing identifiers.

-- The old foreign key points to the text User.id, so remove it before the
-- surrogate integer columns are introduced.
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";
DROP INDEX IF EXISTS "Session_userId_idx";

-- Add integer User ids and varchar UUIDs alongside the existing columns.
ALTER TABLE "User" ADD COLUMN "new_id" INTEGER;
CREATE SEQUENCE "User_id_seq";
ALTER TABLE "User" ALTER COLUMN "new_id" SET DEFAULT nextval('"User_id_seq"');
ALTER SEQUENCE "User_id_seq" OWNED BY "User"."new_id";
UPDATE "User" SET "new_id" = nextval('"User_id_seq"');
ALTER TABLE "User" ALTER COLUMN "new_id" SET NOT NULL;

ALTER TABLE "User" ADD COLUMN "new_uuid" VARCHAR(36);
WITH generated_uuids AS (
  SELECT
    "id",
    md5("id" || random()::text || clock_timestamp()::text) AS hash
  FROM "User"
)
UPDATE "User" AS target
SET "new_uuid" = substr(generated_uuids.hash, 1, 8)
  || '-'
  || substr(generated_uuids.hash, 9, 4)
  || '-'
  || substr(generated_uuids.hash, 13, 4)
  || '-'
  || substr(generated_uuids.hash, 17, 4)
  || '-'
  || substr(generated_uuids.hash, 21, 12)
FROM generated_uuids
WHERE target."id" = generated_uuids."id";
ALTER TABLE "User" ALTER COLUMN "new_uuid" SET NOT NULL;

-- Add integer Session ids, varchar UUID session tokens, and the new integer
-- foreign key. Existing sessions are mapped through the old text User.id.
ALTER TABLE "Session" ADD COLUMN "new_id" INTEGER;
CREATE SEQUENCE "Session_id_seq";
ALTER TABLE "Session" ALTER COLUMN "new_id" SET DEFAULT nextval('"Session_id_seq"');
ALTER SEQUENCE "Session_id_seq" OWNED BY "Session"."new_id";
UPDATE "Session" SET "new_id" = nextval('"Session_id_seq"');
ALTER TABLE "Session" ALTER COLUMN "new_id" SET NOT NULL;

ALTER TABLE "Session" ADD COLUMN "new_uuid" VARCHAR(36);
WITH generated_uuids AS (
  SELECT
    "id",
    md5("id" || random()::text || clock_timestamp()::text) AS hash
  FROM "Session"
)
UPDATE "Session" AS target
SET "new_uuid" = substr(generated_uuids.hash, 1, 8)
  || '-'
  || substr(generated_uuids.hash, 9, 4)
  || '-'
  || substr(generated_uuids.hash, 13, 4)
  || '-'
  || substr(generated_uuids.hash, 17, 4)
  || '-'
  || substr(generated_uuids.hash, 21, 12)
FROM generated_uuids
WHERE target."id" = generated_uuids."id";
ALTER TABLE "Session" ALTER COLUMN "new_uuid" SET NOT NULL;

ALTER TABLE "Session" ADD COLUMN "new_userId" INTEGER;
UPDATE "Session" AS session
SET "new_userId" = app_user."new_id"
FROM "User" AS app_user
WHERE session."userId" = app_user."id";
ALTER TABLE "Session" ALTER COLUMN "new_userId" SET NOT NULL;

-- Replace the old text primary keys and foreign-key column names.
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey";
ALTER TABLE "User" DROP CONSTRAINT "User_pkey";

ALTER TABLE "Session" DROP COLUMN "id";
ALTER TABLE "Session" DROP COLUMN "userId";
ALTER TABLE "User" DROP COLUMN "id";

ALTER TABLE "User" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "User" RENAME COLUMN "new_uuid" TO "uuid";
ALTER TABLE "Session" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "Session" RENAME COLUMN "new_uuid" TO "uuid";
ALTER TABLE "Session" RENAME COLUMN "new_userId" TO "userId";

ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
ALTER TABLE "Session" ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");
CREATE UNIQUE INDEX "Session_uuid_key" ON "Session"("uuid");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

ALTER TABLE "Session"
  ADD CONSTRAINT "Session_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
