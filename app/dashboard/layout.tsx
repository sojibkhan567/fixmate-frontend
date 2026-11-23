"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/layouts/Sidebar"
import { DashboardHeader } from "@/components/layouts/Header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // close the mobile drawer on navigation
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname])

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Route guard: sign-in required, and users stay inside their own role area
  useEffect(() => {
    if (loading) return
    if (!user) {
      //router.replace(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`)
      router.replace("/")
      return
    }

    // Shared routes accessible by every logged-in user
    const sharedRoutes = ["/dashboard/profile"]

    const isSharedRoute = sharedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )

    if (isSharedRoute) return

    // User's own role dashboard
    const own = `/dashboard/${user.role}`
    if (pathname !== own && !pathname.startsWith(`${own}/`)) router.replace(own)
  }, [loading, user, pathname, router])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50/40">
        <div className="size-8 animate-spin rounded-full border-2 border-amber-200 border-t-amber-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50/40">
      <Sidebar
        role={user.role}
        open={open}
        onClose={() => setOpen(false)}
        onSignOut={async () => {
          await signOut()
          router.replace("/sign-in")
        }}
      />
      <div className="lg:pl-64">
        <DashboardHeader user={user} onMenuClick={() => setOpen(true)} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
