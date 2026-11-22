import { z } from "zod"

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(60, "Name is too long"),
    email: z.string().trim().toLowerCase().email("Enter a valid email address"),
    phone: z
      .string()
      .trim()
      .regex(
        /^(\+?88)?01[3-9]\d{8}$/,
        "Enter a valid Bangladeshi mobile number"
      ),
    area: z
      .string()
      .trim()
      .min(2, "Enter your city / area")
      .max(80, "Area is too long"),
    // Optional: can be left empty (or null) — stored as "" when blank
    bio: z
      .string()
      .trim()
      .max(30, "Bio must be 300 characters or fewer")
      .nullish(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/\d/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export type RegisterValues = z.infer<typeof registerSchema>
