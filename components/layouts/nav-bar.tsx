"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
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
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState<string | null>(null) // home-page section in view
  const close = () => setOpen(false)

  // Home page: highlight the "How it works / Categories / FAQ" link of the section in view
  useEffect(() => {
    if (pathname !== "/") {
      setSection(null)
      return
    }
    const ids = links
      .filter((l) => l.href.startsWith("/#"))
      .map((l) => l.href.slice(2))
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSection(e.target.id)
      },
      { rootMargin: "-45% 0px -50% 0px" } // a thin band across the middle of the screen
    )
    els.forEach((el) => io.observe(el))

    const onScroll = () => window.scrollY < 200 && setSection(null) // back at the top → Home
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [pathname])

  const isActive = (href: string) => {
    if (href.startsWith("/#"))
      return pathname === "/" && section === href.slice(2)
    if (href === "/") return pathname === "/" && !section
    return pathname === href || pathname.startsWith(`${href}/`)
  }

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
          {links.map((l) => {
            const active = isActive(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={
                  active
                    ? l.href.startsWith("/#")
                      ? "location"
                      : "page"
                    : undefined
                }
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-amber-100 text-amber-950"
                    : "text-muted-foreground hover:bg-amber-50 hover:text-amber-900"
                }`}
              >
                {l.label}
              </Link>
            )
          })}
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
            {links.map((l) => {
              const active = isActive(l.href)
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  aria-current={
                    active
                      ? l.href.startsWith("/#")
                        ? "location"
                        : "page"
                      : undefined
                  }
                  className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                    active ? "bg-amber-100 text-amber-950" : "hover:bg-amber-50"
                  }`}
                >
                  {l.label}
                </Link>
              )
            })}
          </nav>
          {!user && !loading && (
            <div className="mt-3 flex gap-2">{guestButtons}</div>
          )}
        </div>
      )}
    </header>
  )
}
