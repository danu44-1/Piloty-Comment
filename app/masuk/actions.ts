"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { skemaMasuk } from "@/lib/scheme/login";
import { buatSesi, hapusSesi } from "@/lib/scheme/session";
import { AKSES_DUMMY } from "@/lib/types/access";
import type { StatusForm } from "@/lib/status-form";

function nilaiEmail(formData: FormData) {
  const email = formData.get("email");
  return typeof email === "string" ? email : "";
}

export async function masuk(
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  const email = nilaiEmail(formData);
  const hasil = skemaMasuk.safeParse({
    email,
    kataSandi: formData.get("kataSandi"),
  });

  const nilai = { email };

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      nilai,
    };
  }

  const emailDemo = process.env.DEMO_EMAIL ?? AKSES_DUMMY.email;
  const kataSandiDemo = process.env.DEMO_KATA_SANDI ?? AKSES_DUMMY.kataSandi;

  const kredensialBenar =
    hasil.data.email.toLowerCase() === emailDemo.trim().toLowerCase() &&
    hasil.data.kataSandi === kataSandiDemo;

  if (!kredensialBenar) {
    return {
      pesan: "Email atau kata sandi salah.",
      nilai,
    };
  }

  await buatSesi(hasil.data.email);
  redirect("/");
}

export async function keluar() {
  await hapusSesi();
  redirect("/masuk");
}
