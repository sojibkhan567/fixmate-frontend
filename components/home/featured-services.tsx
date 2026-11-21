import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Service } from "@/types/services"
import { SectionHeading } from "./section-heading"
import { ServiceCard } from "./service-card"

export function FeaturedServices({ services }: { services: Service[] }) {
  return (
    <section
      id="services"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-20"
    >
      <SectionHeading
        eyebrow="Latest services"
        title="Freshly added repair services"
        subtitle="Approved by our team and ready to book right now."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <ServiceCard key={s._id} service={s} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          nativeButton={false}
          render={<Link href="/services" />}
          variant="outline"
          className="border-amber-300 text-amber-900 hover:bg-amber-50"
        >
          See all services <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  )
}
