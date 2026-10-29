import "server-only";

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { AKSES_DUMMY } from "@/lib/types/access";

type AkunTersimpan = {
  email: string;
  salt: string;
  kataSandiHash: string;
};

type PenyimpananAkunGlobal = typeof globalThis & {
  __pilotyCommentAccounts?: Map<string, AkunTersimpan>;
};

const globalDenganPenyimpanan = globalThis as PenyimpananAkunGlobal;
const akun =
  globalDenganPenyimpanan.__pilotyCommentAccounts ??
  new Map<string, AkunTersimpan>();

globalDenganPenyimpanan.__pilotyCommentAccounts = akun;

function normalisasiEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashKataSandi(kataSandi: string, salt: string) {
  return scryptSync(kataSandi, salt, 64).toString("hex");
}

function simpanAkunAwal(email: string, kataSandi: string) {
  const emailNormal = normalisasiEmail(email);
  if (!emailNormal || akun.has(emailNormal)) return;

  const salt = randomBytes(16).toString("hex");
  akun.set(emailNormal, {
    email: emailNormal,
    salt,
    kataSandiHash: hashKataSandi(kataSandi, salt),
  });
}

simpanAkunAwal(AKSES_DUMMY.email, AKSES_DUMMY.kataSandi);

if (process.env.DEMO_EMAIL && process.env.DEMO_KATA_SANDI) {
  simpanAkunAwal(process.env.DEMO_EMAIL, process.env.DEMO_KATA_SANDI);
}

export function emailSudahTerdaftar(email: string) {
  return akun.has(normalisasiEmail(email));
}

export function buatAkun(email: string, kataSandi: string) {
  const emailNormal = normalisasiEmail(email);
  if (emailSudahTerdaftar(emailNormal)) return false;

  const salt = randomBytes(16).toString("hex");
  akun.set(emailNormal, {
    email: emailNormal,
    salt,
    kataSandiHash: hashKataSandi(kataSandi, salt),
  });

  return true;
}

export function verifikasiAkun(email: string, kataSandi: string) {
  const dataAkun = akun.get(normalisasiEmail(email));
  if (!dataAkun) return false;

  const hashMasukan = Buffer.from(hashKataSandi(kataSandi, dataAkun.salt), "hex");
  const hashTersimpan = Buffer.from(dataAkun.kataSandiHash, "hex");

  return (
    hashMasukan.length === hashTersimpan.length &&
    timingSafeEqual(hashMasukan, hashTersimpan)
  );
}
