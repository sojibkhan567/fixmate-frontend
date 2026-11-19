import { AddServiceForm } from "@/components/services/add-service-form"

export default async function AddServicePage() {
  // TODO: replace with your real auth/session (NextAuth, Firebase, JWT, etc.)
  const technician = { name: "Demo Technician", email: "tech@example.com" }

  return (
    <main className="container py-10">
      <AddServiceForm technician={technician} />
    </main>
  )
}
