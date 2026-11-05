import "server-only";

import { cache } from "react";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

export type Sesi = {
  userId: number;
  email: string;
  kedaluwarsa: Date;
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
    userId: sesi.userId,
    email: sesi.user.email,
    kedaluwarsa: sesi.expiresAt,
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
