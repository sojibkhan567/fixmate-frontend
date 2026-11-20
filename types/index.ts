export type Role = "customer" | "technician" | "admin"

export type User = {
  id: string
  name: string
  email: string
  image?: string | null
  role: Role
  createdAt: string
}
