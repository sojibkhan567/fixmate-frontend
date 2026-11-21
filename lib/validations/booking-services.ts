import { z } from "zod"

export const bookingSchema = z.object({
  serviceId: z.string().min(1),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,15}$/, "Enter a valid phone number"),
  address: z.string().trim().min(5, "Enter your full address"),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
  problemDescription: z
    .string()
    .trim()
    .min(20, "Describe the problem in at least 20 characters"),
})

export type BookingInput = z.infer<typeof bookingSchema>
