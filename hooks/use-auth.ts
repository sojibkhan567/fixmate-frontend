"use client"

import { useMemo } from "react"
import { authClient } from "@/lib/auth-client"

export type Role = "customer" | "technician" | "admin"

export type AuthUser = {
  id: string
  name: string
  email: string
  image?: string | null
  role: Role
}

const ROLES: Role[] = ["customer", "technician", "admin"]
const toRole = (r: unknown): Role =>
  ROLES.includes(r as Role) ? (r as Role) : "customer"

/**
 * App-wide auth hook, backed by Better Auth's session.
 *  - user:    null when signed out
 *  - loading: true while the session is being fetched
 *  - signOut: ends the session on the server and clears the cookie
 */
export function useAuth(): {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
} {
  const { data, isPending } = authClient.useSession()
  const raw = data?.user

  const user = useMemo<AuthUser | null>(
    () =>
      raw
        ? {
            id: raw.id,
            name: raw.name ?? "",
            email: raw.email,
            image: raw.image ?? null,
            role: toRole((raw as { role?: unknown }).role),
          }
        : null,
    [raw]
  )

  return {
    user,
    loading: isPending,
    signOut: async () => {
      await authClient.signOut()
    },
  }
}
