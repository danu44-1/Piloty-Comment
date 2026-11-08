import "server-only";

import { cache } from "react";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

export type Sesi = {
  id?: number;
  uuid?: string;
  userId: number;
  email: string;
  kedaluwarsa: Date;
  dibuatPada?: Date;
};

export type InfoSesi = {
  id: number;
  uuid: string;
  expiresAt: Date;
  createdAt: Date;
};

const NAMA_COOKIE_SESI = "sesi";
const DELAPAN_JAM = 60 * 60 * 8;

export async function buatSesi(userId: number) {
  const uuid = randomUUID();
  const kedaluwarsa = new Date(Date.now() + DELAPAN_JAM * 1000);

  await prisma.session.create({
    data: { uuid, userId, expiresAt: kedaluwarsa },
  });

  const tokoCookie = await cookies();
  tokoCookie.set(NAMA_COOKIE_SESI, uuid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DELAPAN_JAM,
  });
}

export const bacaSesi = cache(async (): Promise<Sesi | null> => {
  const uuid = (await cookies()).get(NAMA_COOKIE_SESI)?.value;
  if (!uuid) return null;

  const sesi = await prisma.session.findUnique({
    where: { uuid },
    include: { user: { select: { email: true } } },
  });

  if (!sesi || sesi.expiresAt <= new Date()) {
    if (sesi) await prisma.session.deleteMany({ where: { uuid } });
    return null;
  }

  return {
    id: sesi.id,
    uuid: sesi.uuid,
    userId: sesi.userId,
    email: sesi.user.email,
    kedaluwarsa: sesi.expiresAt,
    dibuatPada: sesi.createdAt,
  };
});

export async function wajibSesi() {
  const sesi = await bacaSesi();
  if (!sesi) redirect("/auth/login");
  return sesi;
}

export async function hapusSesi() {
  const tokoCookie = await cookies();
  const uuid = tokoCookie.get(NAMA_COOKIE_SESI)?.value;

  if (uuid) await prisma.session.deleteMany({ where: { uuid } });
  tokoCookie.delete(NAMA_COOKIE_SESI);
}

/** Read: Ambil daftar seluruh sesi aktif milik user dari database */
export async function ambilDaftarSesi(userId: number): Promise<InfoSesi[]> {
  return prisma.session.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      uuid: true,
      expiresAt: true,
      createdAt: true,
    },
  });
}

/** Update: Perpanjang durasi waktu sesi di database dan perbarui cookie */
export async function perpanjangSesi(tambahanJam = 8): Promise<boolean> {
  const tokoCookie = await cookies();
  const uuid = tokoCookie.get(NAMA_COOKIE_SESI)?.value;
  if (!uuid) return false;

  const sesi = await prisma.session.findUnique({ where: { uuid } });
  if (!sesi || sesi.expiresAt <= new Date()) {
    return false;
  }

  const batasWaktuBaru = new Date(Date.now() + tambahanJam * 60 * 60 * 1000);
  await prisma.session.update({
    where: { uuid },
    data: { expiresAt: batasWaktuBaru },
  });

  tokoCookie.set(NAMA_COOKIE_SESI, uuid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: tambahanJam * 60 * 60,
  });

  return true;
}

/** Delete: Hapus sesi tertentu berdasarkan id dan userId */
export async function hapusSesiById(sessionId: number, userId: number): Promise<boolean> {
  const hasil = await prisma.session.deleteMany({
    where: { id: sessionId, userId },
  });
  return hasil.count > 0;
}
