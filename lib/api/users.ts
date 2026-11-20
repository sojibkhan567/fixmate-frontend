import { headers } from "next/headers"
import { auth } from "../auth"
import { API_BASE_URL } from "./config"
import { User } from "@/types"

// Returns every user from the backend.
// Used by the admin users page (Server Component only).
export async function getAllUsers(): Promise<User[]> {
  const jwtToken = await auth.api.getToken({ headers: await headers() })
  if (!jwtToken) {
    throw new Error("No token found. User must be logged in to fetch users.")
  }
  const token = jwtToken?.token

  const res = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Could not load users (status ${res.status}).`)
  }

  const body = await res.json()
  return body.data ?? []
}
