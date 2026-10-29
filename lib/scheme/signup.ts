import { z } from "zod";

export const skemaDaftar = z
  .object({
    email: z
      .string({ error: "Email wajib diisi." })
      .trim()
      .min(1, { error: "Email wajib diisi." })
      .pipe(z.email({ error: "Format email tidak valid." })),
    kataSandi: z
      .string({ error: "Kata sandi wajib diisi." })
      .min(8, { error: "Kata sandi minimal 8 karakter." }),
    konfirmasiKataSandi: z
      .string({ error: "Konfirmasi kata sandi wajib diisi." })
      .min(1, { error: "Konfirmasi kata sandi wajib diisi." }),
  })
  .refine((data) => data.kataSandi === data.konfirmasiKataSandi, {
    error: "Konfirmasi kata sandi tidak cocok.",
    path: ["konfirmasiKataSandi"],
  });

export type MasukanDaftar = z.infer<typeof skemaDaftar>;
