"use client"

import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import type { AuthUser } from "@/hooks/use-auth"
import { getNav, isActive, ROLE_LABEL } from "@/lib/dashboard-nav"

export function DashboardHeader({
  user,
  onMenuClick,
}: {
  user: AuthUser
  onMenuClick: () => void
}) {
  const pathname = usePathname()
  const current = getNav(user.role).find((i) => isActive(pathname, i))
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-amber-200 bg-background/85 px-4 backdrop-blur supports-backdrop-filter:bg-background/70 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onMenuClick}
          className="rounded-md p-2 hover:bg-amber-50 lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight">
          {current?.label ?? "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right leading-tight sm:block">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">
            {ROLE_LABEL[user.role]}
          </p>
        </div>
        <span
          aria-hidden
          className="flex size-9 items-center justify-center rounded-full bg-amber-500 text-sm font-semibold text-amber-950 ring-2 ring-amber-200"
        >
          {initials || "U"}
        </span>
      </div>
    </header>
  )
}
