import type { Service, ServiceFilters } from "@/types/services"
import { getTokenFromClient } from "../getTokenFromClient"

export const API_URL = process.env.API_URL ?? "http://localhost:5000"
export const SERVICES_PATH = "/admin/services"
export const TECHNICIAN_PATH = "/technician/my-services"

// GET /admin/services?approvalStatus=pending&search=ac&category=Cooling
export async function getServices(filters: ServiceFilters): Promise<Service[]> {
  const params = new URLSearchParams()
  if (filters.status !== "all") params.set("approvalStatus", filters.status)
  if (filters.search) params.set("search", filters.search)
  if (filters.category !== "all") params.set("category", filters.category)

  const res = await fetch(`${API_URL}${SERVICES_PATH}?${params}`, {
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Could not load services.")
  const data = await res.json()
  return Array.isArray(data) ? data : (data.data ?? data.services ?? [])
}

/** GET /services/:id → returns null when missing / not approved / unavailable */
export async function getService(id: string): Promise<Service | null> {
  try {
    const res = await fetch(`${API_URL}/services/${id}`, { cache: "no-store" })
    if (!res.ok) return null
    const service: Service = await res.json()
    if (service.approvalStatus !== "approved" || service.isAvailable === false)
      return null
    return service
  } catch {
    return null
  }
}

export type BookingPayload = {
  serviceId: string
  phone: string
  address: string
  preferredDate: string // yyyy-mm-dd
  problemDescription: string
}
/**
 * POST /bookings  (cookie/JWT auth)
 * Express should: check role === customer, refuse duplicates (409) when the
 * customer has a requested/accepted/inprogress booking for the service, and
 * save status: "requested", paymentStatus: "unpaid" + service/technician copy.
 */
export async function createBooking(payload: BookingPayload) {
  const token = await getTokenFromClient()
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

/**
 * GET /bookings/active?serviceId=...  (cookie/JWT auth)
 * Expected response: { active: boolean } — true when the logged-in customer has
 * a requested / accepted / inprogress booking for this service.
 */
export async function hasActiveBooking(serviceId: string): Promise<boolean> {
  try {
    const token = await getTokenFromClient()
    const res = await fetch(
      `${API_URL}/bookings/active?serviceId=${encodeURIComponent(serviceId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    )
    if (!res.ok) return false
    const data = await res.json()
    return Boolean(data.active)
  } catch {
    return false // server still refuses duplicates with 409
  }
}
