import DashboardShell from "@/components/layouts/DashboardShell"
import { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Dashboard | FixMate",
  description:
    "Smart Attendance &amp; Payroll Management for SMBs in Bangladesh",
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return <DashboardShell>{children}</DashboardShell>
}
