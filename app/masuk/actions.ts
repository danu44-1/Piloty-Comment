"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { verifikasiAkun } from "@/lib/data/account";
import { skemaMasuk } from "@/lib/scheme/login";
import { buatSesi, hapusSesi } from "@/lib/scheme/session";
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

  if (!verifikasiAkun(hasil.data.email, hasil.data.kataSandi)) {
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
