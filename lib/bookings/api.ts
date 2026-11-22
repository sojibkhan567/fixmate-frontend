import { Booking } from "@/types/bookings"
import { getTokenFromClient } from "../getTokenFromClient"
import { API_URL } from "../services/api"

/** GET /bookings/my → all bookings of the logged-in customer (newest first) */
export async function getMyBookings(): Promise<Booking[]> {
  const token = await getTokenFromClient()
  const res = await fetch(`${API_URL}/bookings/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to load bookings")
  return res.json()
}

/** PATCH /bookings/:id/cancel → sets status: "cancelled" (only from "requested") */
export async function cancelBooking(id: string) {
  const token = await getTokenFromClient()
  const res = await fetch(`${API_URL}/bookings/${id}/cancel`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

/** POST /bookings/:id/checkout → { url } of a Stripe Checkout Session */
export async function startCheckout(id: string) {
  const token = await getTokenFromClient()
  const res = await fetch(`${API_URL}/bookings/${id}/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

/** GET /bookings/:id/verify-payment?session_id=... → { paid } (marks the booking paid if Stripe says so) */
export async function verifyPayment(id: string, sessionId: string) {
  try {
    const token = await getTokenFromClient()
    const res = await fetch(
      `${API_URL}/bookings/${id}/verify-payment?session_id=${encodeURIComponent(sessionId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )
    const data = await res.json().catch(() => ({}))
    return Boolean(res.ok && data.paid)
  } catch {
    return false
  }
}
