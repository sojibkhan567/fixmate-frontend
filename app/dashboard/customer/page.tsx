// app/dashboard/customer/page.tsx
import type { Metadata } from "next"
import StatsOverview from "@/components/dashboard/stats-overview"

export const metadata: Metadata = {
  title: "Customer Dashboard",
  description:
    "Overview of your service requests, active jobs and completed jobs.",
}

export default function CustomerDashboardPage() {
  return <StatsOverview role="customer" />
}
