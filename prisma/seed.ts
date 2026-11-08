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
  const email = process.env.DEMO_EMAIL?.trim().toLowerCase();
  const kataSandi = process.env.DEMO_KATA_SANDI;

  if (!email || !kataSandi) {
    console.log("DEMO_EMAIL dan DEMO_KATA_SANDI kosong; seed dilewati.");
    return;
  }

  const salt = buatSalt();
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      salt,
      passwordHash: hashKataSandi(kataSandi, salt),
    },
  });

  console.log(`Akun demo tersedia untuk ${email}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
