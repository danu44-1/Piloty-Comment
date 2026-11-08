import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { buatSalt, hashKataSandi } from "../lib/utils/password";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL wajib diisi untuk menjalankan seed Prisma.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const email = process.env.DEMO_EMAIL?.trim().toLowerCase() || "demo@piloty.test";
  const kataSandi = process.env.DEMO_KATA_SANDI || "DemoPassword123!";

  const salt = buatSalt();
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      salt,
      passwordHash: hashKataSandi(kataSandi, salt),
    },
  });

  console.log(`Akun demo sintetis tersedia: ${email} (ID: ${user.id}).`);

  // Seeding relasi entitas: memastikan ada sesi sintetis demo terkait
  const sesiAda = await prisma.session.findFirst({
    where: { userId: user.id },
  });

  if (!sesiAda) {
    const kedaluwarsa = new Date(Date.now() + 8 * 60 * 60 * 1000);
    await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: kedaluwarsa,
      },
    });
    console.log(`Sesi demo sintetis berhasil dibuat untuk user ID: ${user.id}.`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
