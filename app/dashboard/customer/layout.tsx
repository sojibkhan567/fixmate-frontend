import React from "react"
import { requireRole } from "@/lib/core/server"

const CustomerDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  await requireRole("customer")
  return children
}

export default CustomerDashboardLayout
