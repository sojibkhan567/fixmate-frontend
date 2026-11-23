import { z } from "zod"

export const BIO_MAX = 300

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^\+?[0-9\s-]{7,15}$/.test(v),
      "Enter a valid phone number (7-15 digits)"
    ),
  area: z.string().trim().max(100, "Area must be at most 100 characters"),
  bio: z
    .string()
    .trim()
    .max(BIO_MAX, `Bio must be at most ${BIO_MAX} characters`),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
