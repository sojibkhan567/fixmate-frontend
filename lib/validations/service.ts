import { z } from "zod"

export const SERVICE_CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const

export const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const

/** Fields the technician fills in. */
export const serviceFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be 100 characters or fewer"),
  category: z.enum(SERVICE_CATEGORIES, { message: "Select a category" }),
  description: z
    .string()
    .trim()
    .min(10, "Describe what the service includes (min 10 characters)")
    .max(1000, "Description must be 1000 characters or fewer"),
  image: z.string().url("Upload a banner image"),
  basePrice: z
    .number({ message: "Enter a valid price" })
    .positive("Price must be greater than 0")
    .max(100000, "Price is too high"),
  estimatedDuration: z
    .string()
    .trim()
    .min(1, "Enter an estimated duration, e.g. 2-3 hours")
    .max(50),
  serviceMode: z.enum(SERVICE_MODES, { message: "Select a service mode" }),
  serviceArea: z
    .string()
    .trim()
    .min(2, "Enter the area you cover, e.g. Dhanmondi, Dhaka")
    .max(100),
  isAvailable: z.boolean(),
})

export type ServiceFormValues = z.infer<typeof serviceFormSchema>

/** Payload the API accepts: form fields + technician identity.
 *  approvalStatus ('pending') and createdAt are set on the server. */
export const servicePayloadSchema = serviceFormSchema.extend({
  technicianName: z.string().trim().min(1),
  technicianEmail: z.string().email(),
  approvalStatus: z.enum(["pending", "approved", "rejected"]),
})

export type ServicePayload = z.infer<typeof servicePayloadSchema>
