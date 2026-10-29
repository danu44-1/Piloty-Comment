import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Sesi = {
  email: string;
  kedaluwarsa: number;
};

const NAMA_COOKIE_SESI = "sesi";
const DELAPAN_JAM = 60 * 60 * 8;

type GlobalDenganPenyimpananSesi = typeof globalThis & {
  __pilotyCommentSesi?: Map<string, Sesi>;
};

const globalDenganPenyimpanan = globalThis as GlobalDenganPenyimpananSesi;
const penyimpananSesi =
  globalDenganPenyimpanan.__pilotyCommentSesi ?? new Map<string, Sesi>();

globalDenganPenyimpanan.__pilotyCommentSesi = penyimpananSesi;

export async function buatSesi(email: string) {
  const id = crypto.randomUUID();
  const kedaluwarsa = Date.now() + DELAPAN_JAM * 1000;

  penyimpananSesi.set(id, { email, kedaluwarsa });

  const tokoCookie = await cookies();
  tokoCookie.set(NAMA_COOKIE_SESI, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DELAPAN_JAM,
  });
}

export async function bacaSesi(): Promise<Sesi | null> {
  const id = (await cookies()).get(NAMA_COOKIE_SESI)?.value;
  if (!id) return null;

  const sesi = penyimpananSesi.get(id);
  if (!sesi || sesi.kedaluwarsa <= Date.now()) {
    if (sesi) penyimpananSesi.delete(id);
    return null;
  }

  return sesi;
}

export async function wajibSesi() {
  const sesi = await bacaSesi();
  if (!sesi) redirect("/masuk");
  return sesi;
}

export async function hapusSesi() {
  const tokoCookie = await cookies();
  const id = tokoCookie.get(NAMA_COOKIE_SESI)?.value;

  if (id) penyimpananSesi.delete(id);
  tokoCookie.delete(NAMA_COOKIE_SESI);
}
