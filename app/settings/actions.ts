"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ubahAkun,
  hapusAkun,
  verifikasiKataSandiId,
} from "@/lib/data/account";
import {
  skemaUbahEmail,
  skemaUbahKataSandi,
  skemaHapusAkun,
} from "@/lib/scheme/account";
import {
  wajibSesi,
  hapusSesi,
  perpanjangSesi,
  hapusSesiById,
} from "@/lib/scheme/session";
import type { StatusForm } from "@/lib/status-form";

function nilaiTeks(formData: FormData, nama: string) {
  const nilai = formData.get(nama);
  return typeof nilai === "string" ? nilai : "";
}

/** Update: Memperbarui alamat email akun pengguna */
export async function perbaruiEmail(
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  const sesi = await wajibSesi();
  const emailBaru = nilaiTeks(formData, "emailBaru");
  const kataSandiSaatIni = nilaiTeks(formData, "kataSandiSaatIni");

  const hasil = skemaUbahEmail.safeParse({
    emailBaru,
    kataSandiSaatIni,
  });

  const nilai = { emailBaru };

  if (!hasil.success) {
    return {
      sukses: false,
      galat: z.flattenError(hasil.error).fieldErrors,
      nilai,
    };
  }

  // Verifikasi kata sandi lama sebelum mengizinkan pembaruan email
  const sandiCocok = await verifikasiKataSandiId(sesi.userId, hasil.data.kataSandiSaatIni);
  if (!sandiCocok) {
    return {
      sukses: false,
      galat: {
        kataSandiSaatIni: ["Kata sandi saat ini tidak valid."],
      },
      nilai,
    };
  }

  // Periksa apakah email baru sama dengan email lama
  if (hasil.data.emailBaru.toLowerCase() === sesi.email.toLowerCase()) {
    return {
      sukses: false,
      galat: {
        emailBaru: ["Email baru sama dengan email saat ini."],
      },
      nilai,
    };
  }

  const akunTerbarui = await ubahAkun(sesi.userId, { email: hasil.data.emailBaru });
  if (!akunTerbarui) {
    return {
      sukses: false,
      galat: {
        emailBaru: ["Email tersebut sudah terdaftar pada akun lain."],
      },
      nilai,
    };
  }

  revalidatePath("/settings");
  revalidatePath("/");
  return {
    sukses: true,
    pesan: "Alamat email berhasil diperbarui.",
    nilai: { emailBaru: "" },
  };
}

/** Update: Memperbarui kata sandi akun pengguna */
export async function perbaruiKataSandi(
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  const sesi = await wajibSesi();
  const kataSandiLama = nilaiTeks(formData, "kataSandiLama");
  const kataSandiBaru = nilaiTeks(formData, "kataSandiBaru");
  const konfirmasiKataSandiBaru = nilaiTeks(formData, "konfirmasiKataSandiBaru");

  const hasil = skemaUbahKataSandi.safeParse({
    kataSandiLama,
    kataSandiBaru,
    konfirmasiKataSandiBaru,
  });

  if (!hasil.success) {
    return {
      sukses: false,
      galat: z.flattenError(hasil.error).fieldErrors,
    };
  }

  // Verifikasi kata sandi lama
  const sandiCocok = await verifikasiKataSandiId(sesi.userId, hasil.data.kataSandiLama);
  if (!sandiCocok) {
    return {
      sukses: false,
      galat: {
        kataSandiLama: ["Kata sandi saat ini tidak cocok."],
      },
    };
  }

  await ubahAkun(sesi.userId, { kataSandi: hasil.data.kataSandiBaru });

  revalidatePath("/settings");
  return {
    sukses: true,
    pesan: "Kata sandi berhasil diperbarui dengan aman (KDF scrypt).",
  };
}

/** Update: Perpanjang masa aktif sesi saat ini di database */
export async function perpanjangSesiAction(): Promise<StatusForm> {
  await wajibSesi();
  const berhasil = await perpanjangSesi(8);

  if (!berhasil) {
    return {
      sukses: false,
      pesan: "Gagal memperpanjang masa aktif sesi.",
    };
  }

  revalidatePath("/settings");
  revalidatePath("/");
  return {
    sukses: true,
    pesan: "Masa aktif sesi berhasil diperpanjang 8 jam ke depan.",
  };
}

/** Delete: Mengakhiri sesi tertentu dari daftar sesi */
export async function akhiriSesiTertentuAction(formData: FormData): Promise<void> {
  const sesi = await wajibSesi();
  const idStr = formData.get("sessionId");
  const id = typeof idStr === "string" ? parseInt(idStr, 10) : NaN;

  if (!Number.isNaN(id)) {
    if (sesi.id === id) {
      await hapusSesi();
      redirect("/auth/login");
    } else {
      await hapusSesiById(id, sesi.userId);
      revalidatePath("/settings");
    }
  }
}

/** Delete: Menghapus akun pengguna dan seluruh sesi terkait secara atomik */
export async function hapusAkunPengguna(
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  const sesi = await wajibSesi();
  const kataSandiKonfirmasi = nilaiTeks(formData, "kataSandiKonfirmasi");
  const teksKonfirmasi = nilaiTeks(formData, "teksKonfirmasi");

  const hasil = skemaHapusAkun.safeParse({
    kataSandiKonfirmasi,
    teksKonfirmasi,
  });

  if (!hasil.success) {
    return {
      sukses: false,
      galat: z.flattenError(hasil.error).fieldErrors,
    };
  }

  // Verifikasi kata sandi sebelum eksekusi penghapusan atomik
  const sandiCocok = await verifikasiKataSandiId(sesi.userId, hasil.data.kataSandiKonfirmasi);
  if (!sandiCocok) {
    return {
      sukses: false,
      galat: {
        kataSandiKonfirmasi: ["Kata sandi konfirmasi salah."],
      },
    };
  }

  // Hapus akun beserta seluruh sesi melalui transaksi database RESTRICT
  await hapusAkun(sesi.userId);
  await hapusSesi();

  redirect("/auth/signup?dihapus=1");
}
