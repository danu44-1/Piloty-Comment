import { z } from "zod";

export const skemaMasuk = z.object({
  email: z
    .string({ error: "Email wajib diisi." })
    .trim()
    .min(1, { error: "Email wajib diisi." })
    .pipe(z.email({ error: "Format email tidak valid." })),
  kataSandi: z
    .string({ error: "Kata sandi wajib diisi." })
    .min(8, { error: "Kata sandi minimal 8 karakter." }),
});

export type MasukanMasuk = z.infer<typeof skemaMasuk>;
