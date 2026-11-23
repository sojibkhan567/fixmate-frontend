"use client"

import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import type { AuthUser } from "@/hooks/use-auth"
import { getNav, isActive } from "@/lib/dashboard-nav"
import { UserMenu } from "../common/user-menu"

export function DashboardHeader({
  user,
  onMenuClick,
}: {
  user: AuthUser
  onMenuClick: () => void
}) {
  const pathname = usePathname()
  const current = getNav(user.role).find((i) => isActive(pathname, i))

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

      <UserMenu user={user} redirectTo="/" />
    </header>
  )
}
