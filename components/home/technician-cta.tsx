import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const perks = ["Get repair requests from nearby customers", "Set your own prices and service area", "Guaranteed payment after each completed job"];

export function TechnicianCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-amber-500 px-6 py-12 text-amber-950 sm:px-12 lg:px-16">
        <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-amber-400/70" />
        <div aria-hidden className="absolute -bottom-24 right-24 size-56 rounded-full bg-amber-600/30" />

        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-900/80">For technicians</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Are you a repair expert? Grow your business with FixMate.
            </h2>
            <p className="mt-3 max-w-md text-amber-950/80">
              List your services, get verified, and start receiving requests in your area.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                nativeButton={false}
                render={<Link href="/sign-up" />}
                size="lg"
                className="bg-stone-950 text-amber-50 hover:bg-stone-800"
              >
                Join as a technician
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/services" />}
                size="lg"
                variant="outline"
                className="border-amber-950/30 bg-transparent hover:bg-amber-400"
              >
                Explore services
              </Button>
            </div>
          </div>

          <ul className="space-y-3 rounded-2xl bg-amber-50/90 p-6">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm font-medium">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-amber-600" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
