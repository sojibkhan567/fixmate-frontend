"use client"

import { useSession } from "@/lib/auth-client"

export type AuthUser = {
  name: string
  email: string
  role: "customer" | "technician" | "admin"
}

export function useAuth(): {
  user: AuthUser | null
  loading: boolean
} {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return {
      user: null,
      loading: true,
    }
  }

  if (!session?.user) {
    return {
      user: null,
      loading: false,
    }
  }

  return {
    user: {
      name: session.user.name,
      email: session.user.email,
      role: (session.user.role ?? "customer") as AuthUser["role"],
    },
    loading: false,
  }
}
