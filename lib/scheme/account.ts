import { z } from "zod";

export const skemaUbahEmail = z.object({
  emailBaru: z
    .string({ error: "Email baru wajib diisi." })
    .trim()
    .min(1, { error: "Email baru wajib diisi." })
    .pipe(z.email({ error: "Format email baru tidak valid." })),
  kataSandiSaatIni: z
    .string({ error: "Kata sandi saat ini wajib diisi." })
    .min(1, { error: "Kata sandi saat ini wajib diisi." }),
});

export type MasukanUbahEmail = z.infer<typeof skemaUbahEmail>;

export const skemaUbahKataSandi = z
  .object({
    kataSandiLama: z
      .string({ error: "Kata sandi saat ini wajib diisi." })
      .min(1, { error: "Kata sandi saat ini wajib diisi." }),
    kataSandiBaru: z
      .string({ error: "Kata sandi baru wajib diisi." })
      .min(8, { error: "Kata sandi baru minimal 8 karakter." }),
    konfirmasiKataSandiBaru: z
      .string({ error: "Konfirmasi kata sandi baru wajib diisi." })
      .min(1, { error: "Konfirmasi kata sandi baru wajib diisi." }),
  })
  .refine((data) => data.kataSandiBaru === data.konfirmasiKataSandiBaru, {
    error: "Konfirmasi kata sandi baru tidak cocok.",
    path: ["konfirmasiKataSandiBaru"],
  });

export type MasukanUbahKataSandi = z.infer<typeof skemaUbahKataSandi>;

export const skemaHapusAkun = z.object({
  kataSandiKonfirmasi: z
    .string({ error: "Kata sandi konfirmasi wajib diisi." })
    .min(1, { error: "Kata sandi konfirmasi wajib diisi." }),
  teksKonfirmasi: z
    .string({ error: "Ketik 'HAPUS AKUN' untuk mengonfirmasi." })
    .trim()
    .refine((val) => val === "HAPUS AKUN", {
      error: "Teks konfirmasi harus tepat 'HAPUS AKUN'.",
    }),
});

export type MasukanHapusAkun = z.infer<typeof skemaHapusAkun>;
