export type TUserRole = "admin" | "technician" | "customer"

// A user as returned by the Express API (GET /users), for the admin page.
export type TAdminUser = {
  _id: string
  name: string
  email: string
  role: TUserRole
  image?: string | null
}
