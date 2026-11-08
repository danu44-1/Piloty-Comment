import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  buatSalt,
  cocokKataSandi,
  hashKataSandi,
} from "@/lib/utils/password";

export type AkunPublik = {
  id: number;
  uuid: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AkunTerverifikasi = Pick<AkunPublik, "id" | "uuid" | "email">;

function normalisasiEmail(email: string) {
  return email.trim().toLowerCase();
}

function keAkunPublik(akun: AkunPublik): AkunPublik {
  return {
    id: akun.id,
    uuid: akun.uuid,
    email: akun.email,
    createdAt: akun.createdAt,
    updatedAt: akun.updatedAt,
  };
}

/** Read: check whether an account exists without exposing password data. */
export async function emailSudahTerdaftar(email: string) {
  const akun = await prisma.user.findUnique({
    where: { email: normalisasiEmail(email) },
    select: { id: true },
  });

  return akun !== null;
}

/** Create: persist a new account with a unique salt and derived password hash. */
export async function buatAkun(email: string, kataSandi: string) {
  const emailNormal = normalisasiEmail(email);
  const salt = buatSalt();

  try {
    await prisma.user.create({
      data: {
        email: emailNormal,
        salt,
        passwordHash: hashKataSandi(kataSandi, salt),
      },
    });

    return true;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return false;
    }

    throw error;
  }
}

/** Read: verify credentials and return only the identity needed for a session. */
export async function verifikasiAkun(
  email: string,
  kataSandi: string,
): Promise<AkunTerverifikasi | null> {
  const akun = await prisma.user.findUnique({
    where: { email: normalisasiEmail(email) },
    select: { id: true, uuid: true, email: true, salt: true, passwordHash: true },
  });

  if (!akun || !cocokKataSandi(kataSandi, akun.salt, akun.passwordHash)) {
    return null;
  }

  return { id: akun.id, uuid: akun.uuid, email: akun.email };
}

/** Read: verify whether a given password is correct for an existing user id. */
export async function verifikasiKataSandiId(
  id: number,
  kataSandi: string,
): Promise<boolean> {
  const akun = await prisma.user.findUnique({
    where: { id },
    select: { salt: true, passwordHash: true },
  });

  if (!akun) {
    return false;
  }

  return cocokKataSandi(kataSandi, akun.salt, akun.passwordHash);
}

/** Read: fetch the public account record by its database id. */
export async function ambilAkun(id: number): Promise<AkunPublik | null> {
  const akun = await prisma.user.findUnique({
    where: { id },
    select: { id: true, uuid: true, email: true, createdAt: true, updatedAt: true },
  });

  return akun ? keAkunPublik(akun) : null;
}

/** Update: change an account email and/or password without returning secrets. */
export async function ubahAkun(
  id: number,
  perubahan: { email?: string; kataSandi?: string },
) {
  const data: Prisma.UserUpdateInput = {};

  if (perubahan.email !== undefined) {
    data.email = normalisasiEmail(perubahan.email);
  }

  if (perubahan.kataSandi !== undefined) {
    const salt = buatSalt();
    data.salt = salt;
    data.passwordHash = hashKataSandi(perubahan.kataSandi, salt);
  }

  try {
    const akun = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, uuid: true, email: true, createdAt: true, updatedAt: true },
    });

    return keAkunPublik(akun);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return null;
    }

    throw error;
  }
}

/**
 * Delete: remove an account and its sessions atomically.
 * Session.userId memakai ON DELETE RESTRICT, jadi sesi dihapus lebih dulu di
 * dalam transaksi yang sama. Jika salah satu langkah gagal, keduanya di-rollback.
 */
export async function hapusAkun(id: number) {
  return prisma.$transaction(async (tx) => {
    await tx.session.deleteMany({ where: { userId: id } });
    const hasil = await tx.user.deleteMany({ where: { id } });
    return hasil.count > 0;
  });
}
