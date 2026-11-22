import { UsersTable } from "@/components/admin/all-users-table"
import { getAllUsers } from "@/lib/api/users"
import { auth } from "@/lib/auth"
import { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Users | FixMate",
  description:
    "Find trusted technicians and professional repair services near you.",
}

const AdminUsersPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/signin")
  }

  const role = session.user.role ?? "user"
  if (role !== "admin") {
    redirect(`/dashboard/${role}`)
  }

  const users = await getAllUsers()

  console.log(users, "users")
  const currentUserId = session.user.id

  return <UsersTable users={users} currentUserId={currentUserId} />
}

export default AdminUsersPage
