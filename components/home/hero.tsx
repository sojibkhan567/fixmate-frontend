import Link from "next/link"
import { BadgeCheck, Clock, ShieldCheck, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroIllustration } from "./hero-illustration"
import { HeroSearch } from "./hero-serach"

const chips = [
  { icon: BadgeCheck, label: "Verified technicians" },
  { icon: Wallet, label: "Pay after completion" },
  { icon: ShieldCheck, label: "Transparent pricing" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-amber-50 via-amber-50/60 to-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#fcd34d_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent_85%)] bg-size-[22px_22px] opacity-60"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
            <span className="size-1.5 rounded-full bg-amber-500" />
            FixMate · Trusted repair marketplace
          </span>

          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Broken Device? Get It Fixed by{" "}
            <span className="text-amber-600">Verified Technicians</span>
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            Compare approved repair services, send a request in a minute, and
            pay only after the job is done.
          </p>

          <HeroSearch />

          <div className="flex flex-wrap items-center gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/services" />}
              size="lg"
              className="bg-amber-500 text-amber-950 hover:bg-amber-400"
            >
              Browse all services
            </Button>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="size-4 text-amber-600" /> Most repairs done the
              same day
            </span>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
            {chips.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-1.5 text-sm font-medium"
              >
                <Icon className="size-4 text-amber-600" /> {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <HeroIllustration className="h-auto w-full" />
          <div className="absolute top-10 left-0 hidden items-center gap-2 rounded-xl border border-amber-200 bg-background px-3 py-2 shadow-md sm:flex">
            <BadgeCheck className="size-5 text-emerald-600" />
            <div className="text-xs leading-tight">
              <p className="font-semibold">Verified pro</p>
              <p className="text-muted-foreground">ID & skills checked</p>
            </div>
          </div>
          <div className="absolute right-0 bottom-10 hidden items-center gap-2 rounded-xl border border-amber-200 bg-background px-3 py-2 shadow-md sm:flex">
            <Clock className="size-5 text-amber-600" />
            <div className="text-xs leading-tight">
              <p className="font-semibold">Fixed in 2 hrs</p>
              <p className="text-muted-foreground">Screen replacement</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
