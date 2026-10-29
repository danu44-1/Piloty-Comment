"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { buatAkun } from "@/lib/data/account";
import { skemaDaftar } from "@/lib/scheme/signup";
import type { StatusForm } from "@/lib/status-form";

function nilaiTeks(formData: FormData, nama: string) {
  const nilai = formData.get(nama);
  return typeof nilai === "string" ? nilai : "";
}

export async function daftar(
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  const nilai = {
    email: nilaiTeks(formData, "email"),
  };

  const hasil = skemaDaftar.safeParse({
    email: nilai.email,
    kataSandi: formData.get("kataSandi"),
    konfirmasiKataSandi: formData.get("konfirmasiKataSandi"),
  });

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      nilai,
    };
  }

  const berhasil = buatAkun(hasil.data.email, hasil.data.kataSandi);
  if (!berhasil) {
    return {
      galat: {
        email: ["Email sudah terdaftar."],
      },
      nilai,
    };
  }

  redirect("/auth/login?terdaftar=1");
}
