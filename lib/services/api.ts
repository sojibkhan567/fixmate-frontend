import "server-only"
import type { Service, ServiceFilters } from "@/types/services"

export const API_URL = process.env.API_URL ?? "http://localhost:5000"
export const SERVICES_PATH = "/admin/services"

// GET /api/admin/services?approvalStatus=pending&search=ac&category=Cooling
export async function getServices(filters: ServiceFilters): Promise<Service[]> {
  const params = new URLSearchParams()
  if (filters.status !== "all") params.set("approvalStatus", filters.status)
  if (filters.search) params.set("search", filters.search)
  if (filters.category !== "all") params.set("category", filters.category)

  const res = await fetch(`${API_URL}${SERVICES_PATH}?${params}`, {
    //headers: { cookie: (await cookies()).toString() },
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Could not load services.")
  const data = await res.json()
  return Array.isArray(data) ? data : (data.data ?? data.services ?? [])
}
