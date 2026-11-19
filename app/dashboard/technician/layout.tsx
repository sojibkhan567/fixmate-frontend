import React from "react"
import { requireRole } from "@/lib/core/server"

const TechnicianDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  await requireRole("technician")
  return children
}

export default TechnicianDashboardLayout
