// app/dashboard/technician/page.tsx
import type { Metadata } from "next"
import StatsOverview from "@/components/dashboard/stats-overview"

export const metadata: Metadata = {
  title: "Technician Dashboard",
  description: "Overview of your services, approvals and pending requests.",
}

export default function TechnicianDashboardPage() {
  return <StatsOverview role="technician" />
}
