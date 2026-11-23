import { AddServiceForm } from "@/components/services/add-service-form"
import { auth } from "@/lib/auth"
import { Metadata } from "next"
import { headers } from "next/headers"

export const metadata: Metadata = {
  title: "Add Services | FixMate",
  description: "The official Next.js Course Dashboard, built with App Router.",
}

export default async function AddServicePage() {
  // TODO: replace with your real auth/session (NextAuth, Firebase, JWT, etc.)
  const session = await auth.api.getSession({ headers: await headers() })
  const technician = {
    name: session?.user.name as string,
    email: session?.user.email as string,
  }

  return (
    <main className="container py-10">
      <AddServiceForm technician={technician} />
    </main>
  )
}
