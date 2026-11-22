"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LogOut, X } from "lucide-react"
import type { Role } from "@/types"
import { getNav, isActive, ROLE_LABEL } from "@/lib/dashboard-nav"
import { Logo } from "../home/nav-bar"

type Props = {
  role: Role
  open: boolean // mobile drawer state
  onClose: () => void
  onSignOut: () => void
}

export function Sidebar({ role, open, onClose, onSignOut }: Props) {
  const pathname = usePathname()
  const items = getNav(role)

  return (
    <>
      {/* mobile overlay */}
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-stone-950/50 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Dashboard sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-amber-200 bg-background transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-amber-100 px-5">
          <Logo />
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-amber-50 lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-5 pt-5 pb-2">
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold tracking-wider text-amber-900 uppercase">
            {ROLE_LABEL[role]} panel
          </span>
        </div>

        <nav
          className="flex-1 space-y-1 overflow-y-auto px-3 py-2"
          aria-label="Dashboard"
        >
          {items.map((item) => {
            const active = isActive(pathname, item)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-amber-100 text-amber-950"
                    : "text-muted-foreground hover:bg-amber-50 hover:text-amber-900"
                }`}
              >
                {active && (
                  <span className="absolute inset-y-1.5 left-0 w-1 rounded-r-full bg-amber-500" />
                )}
                <Icon
                  className={`size-4.5 ${active ? "text-amber-700" : "text-amber-600/70 group-hover:text-amber-700"}`}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="space-y-1 border-t border-amber-100 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-amber-50 hover:text-amber-900"
          >
            <Home className="size-4.5 text-amber-600/70" /> Back to home
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="size-4.5" /> Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
