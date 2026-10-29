import { z } from "zod";

const checkboxToBoolean = z.preprocess(
  (value) => value === true || value === "on" || value === "true",
  z.boolean({
    error: "Status aktif aturan harus berupa boolean.",
  }),
);

export const moderationRuleSchema = z.object({
  keyword: z
    .string({
      error: "Kata kunci harus berupa teks.",
    })
    .trim()
    .min(2, {
      error: "Kata kunci minimal 2 karakter.",
    })
    .max(40, {
      error: "Kata kunci maksimal 40 karakter.",
    }),

  ruleId: z.enum(["spam", "links", "words", "review"], {
    error: "Pilih aturan moderasi: spam, links, words, atau review.",
  }),

  action: z.enum(["Blocked", "Pending", "Allowed"], {
    error: "Aksi harus Blocked, Pending, atau Allowed.",
  }),

  priority: z
    .coerce
    .number({
      error: "Prioritas harus berupa angka.",
    })
    .int({
      error: "Prioritas harus berupa bilangan bulat.",
    })
    .min(1, {
      error: "Prioritas minimal bernilai 1.",
    })
    .max(5, {
      error: "Prioritas maksimal bernilai 5.",
    }),

  enabled: checkboxToBoolean,
});

export type ModerationRuleInput = z.infer<typeof moderationRuleSchema>;