"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, Wrench, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { UserMenu } from "../common/user-menu"

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#categories", label: "Categories" },
  { href: "/#faq", label: "FAQ" },
]

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-semibold tracking-tight"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500 text-amber-950">
        <Wrench className="size-4" />
      </span>
      <span className="text-lg">
        Fix<span className="text-amber-600">Mate</span>
      </span>
    </Link>
  )
}

export function Navbar() {
  const { user, loading } = useAuth()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const guestButtons = (
    <>
      <Button
        nativeButton={false}
        render={<Link href="/sign-in" onClick={close} />}
        variant="ghost"
      >
        Sign in
      </Button>
      <Button
        nativeButton={false}
        render={<Link href="/sign-up" onClick={close} />}
        className="bg-amber-500 text-amber-950 hover:bg-amber-400"
      >
        Get started
      </Button>
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-amber-100 bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-amber-50 hover:text-amber-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* User dropdown stays visible on every screen size, beside the menu toggler.
              Large screens show avatar + name + email; small screens show the avatar only. */}
          {loading ? (
            <span className="size-9 animate-pulse rounded-full bg-amber-100" />
          ) : user ? (
            <UserMenu user={user} redirectTo="/" />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              {guestButtons}
            </div>
          )}

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 hover:bg-amber-50 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu: page links (and sign-in buttons for signed-out visitors) */}
      {open && (
        <div className="border-t border-amber-100 bg-background px-4 pt-2 pb-4 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-amber-50"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          {!user && !loading && (
            <div className="mt-3 flex gap-2">{guestButtons}</div>
          )}
        </div>
      )}
    </header>
  )
}
