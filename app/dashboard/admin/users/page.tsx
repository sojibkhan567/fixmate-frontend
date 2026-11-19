import { getAllUsers } from "@/lib/api/users"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import React from "react"

const AdminUsersPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/signin")
  }
  // console.log(session.session?.token, "session");

  // Only admins may see this page. Other roles go to their own dashboard.
  const role = session.user.role ?? "user"
  if (role !== "admin") {
    redirect(`/dashboard/${role}`)
  }

  const users = await getAllUsers()

  console.log(users, "users")

  return <div>Admin users page</div>
}

export default AdminUsersPage
