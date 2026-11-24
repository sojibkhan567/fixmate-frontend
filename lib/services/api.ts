import type { Service, ServiceFilters } from "@/types/services"
import { getTokenFromClient } from "../getTokenFromClient"
import { Booking, BookingStatus } from "@/types/bookings"

export const API_URL = process.env.NEXT_PUBLIC_API_URL
export const SERVICES_PATH = "/admin/services"
export const TECHNICIAN_PATH = "/technician/my-services"

/*--------------- TYPES: all collection type declaration -------------- */
export type BookingPayload = {
  serviceId: string
  phone: string
  address: string
  preferredDate: string // yyyy-mm-dd
  problemDescription: string
}

export type Payment = {
  _id: string
  bookingId: string
  serviceTitle: string
  customerName: string
  customerEmail: string
  technicianName: string | null
  technicianEmail: string | null
  amount: number
  currency: string
  transactionId: string | null
  stripeSessionId: string
  paymentStatus: "paid"
  paidAt: string
}

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
 * GET /bookings/status?serviceId=...
 * → { booked: boolean, mine: boolean }
 *   booked: any customer has a requested / accepted / inprogress booking for this service
 *   mine:   that booking belongs to the signed-in customer
 */
export async function getBookingStatus(
  serviceId: string
): Promise<{ booked: boolean; mine: boolean }> {
  try {
    const token = await getTokenFromClient()
    const res = await fetch(
      `${API_URL}/bookings/status?serviceId=${encodeURIComponent(serviceId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )
    if (!res.ok) return { booked: false, mine: false }
    const data = await res.json()
    return { booked: Boolean(data.booked), mine: Boolean(data.mine) }
  } catch {
    return { booked: false, mine: false } // server still refuses with 409
  }
}

/* ---------------- Home page ---------------- */

/** GET /services/featured → 6 latest approved + available services (technician attached) */
export async function getFeaturedServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_URL}/services/featured`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

/* ---------------- Technician: manage requests ---------------- */

/** GET /bookings/technician → bookings assigned to the logged-in technician (newest first) */
export async function getTechnicianRequests(): Promise<Booking[]> {
  const token = await getTokenFromClient()
  const res = await fetch(`${API_URL}/bookings/technician`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to load requests")
  return res.json()
}

/**
 * PATCH /bookings/:id/status
 *   requested → accepted | rejected · accepted → inprogress · inprogress → completed (+ finalAmount)
 */
export async function updateBookingStatus(
  id: string,
  status: "accepted" | "rejected" | "inprogress" | "completed",
  finalAmount?: number
) {
  const token = await getTokenFromClient()
  const res = await fetch(`${API_URL}/bookings/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, finalAmount }),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

/* ---------------- Admin: service approval ---------------- */

export type ApprovalStatus = "pending" | "approved" | "rejected"

/** GET /admin/services → all services from all technicians (newest first) */
export async function getAdminServices(): Promise<Service[]> {
  const token = await getTokenFromClient()
  const res = await fetch(`${API_URL}/admin/services`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to load services")
  return res.json()
}

/** PATCH /admin/services/:id/approval  { approvalStatus: "approved" | "rejected" } */
export async function setServiceApproval(
  id: string,
  approvalStatus: "approved" | "rejected"
) {
  const token = await getTokenFromClient()
  const res = await fetch(`${API_URL}/admin/services/${id}/approval`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ approvalStatus }),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

/* ---------------- Admin: all bookings & transactions ---------------- */

export type BookingFilter = "all" | BookingStatus
export type BookingCounts = Record<BookingFilter, number>

/** GET /admin/bookings?status=...  (the server does the filtering) */
export async function getAdminBookings(
  status: BookingFilter
): Promise<{ bookings: Booking[]; counts: BookingCounts }> {
  const token = await getTokenFromClient()
  const res = await fetch(
    `${API_URL}/admin/bookings?status=${encodeURIComponent(status)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  )
  if (!res.ok) throw new Error("Failed to load bookings")
  return res.json()
}

/** GET /admin/transactions → every payment + total revenue (summed on the server) */
export async function getAdminTransactions(): Promise<{
  payments: Payment[]
  totalRevenue: number
  count: number
}> {
  const token = await getTokenFromClient()
  const res = await fetch(`${API_URL}/admin/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to load transactions")
  return res.json()
}

/* ---------------- Customer: payment history ---------------- */

/** GET /payments/my → the logged-in customer's payments (newest first) */
export async function getMyPayments(): Promise<Payment[]> {
  const token = await getTokenFromClient()
  const res = await fetch(`${API_URL}/payments/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to load payments")
  return res.json()
}
