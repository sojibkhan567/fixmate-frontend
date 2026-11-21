import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { Logo } from "./nav-bar"
import { CATEGORIES } from "@/lib/demo-data"

const company = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
  { href: "/sign-up", label: "Become a technician" },
  { href: "/sign-in", label: "Sign in" },
]

export function Footer() {
  return (
    <footer className="border-t border-amber-200 bg-stone-950 text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="space-y-4 [&_a]:text-stone-50">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-stone-400">
            FixMate connects people with verified repair technicians. Request a
            repair, track it, and pay only after the job is done.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-stone-50">
            Repair categories
          </h3>
          <ul className="space-y-2.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.name}>
                <Link
                  href={`/services?category=${encodeURIComponent(c.name)}`}
                  className="transition-colors hover:text-amber-400"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-stone-50">Company</h3>
          <ul className="space-y-2.5 text-sm">
            {company.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="transition-colors hover:text-amber-400"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-stone-50">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 text-amber-500" /> support@fixmate.example
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 text-amber-500" /> +880 1700-000000
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 text-amber-500" /> Dhaka, Bangladesh
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-stone-500 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} FixMate. All rights reserved.</p>
          <p>Verified technicians · Pay after service</p>
        </div>
      </div>
    </footer>
  )
}
