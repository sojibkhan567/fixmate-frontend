// app/dashboard/admin/page.tsx
import type { Metadata } from "next"
import StatsOverview from "@/components/dashboard/stats-overview"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Platform overview of users, technicians and pending services.",
  robots: { index: false, follow: false },
}

export default function AdminDashboardPage() {
  return <StatsOverview role="admin" />
}
