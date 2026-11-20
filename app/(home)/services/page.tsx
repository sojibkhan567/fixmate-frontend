import { Suspense } from "react"
import type { Metadata } from "next"

import { ServicesBrowser } from "@/components/home/services/service-browser"
import { ServiceCardSkeleton } from "@/components/home/services/service-card-skeleton"

export const metadata: Metadata = {
  title: "Browse Services",
  description:
    "Browse approved services from verified local technicians. Home visit or shop drop-off.",
}

// useSearchParams() in the client component needs a Suspense boundary.
function ServicesFallback() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-amber-50 via-stone-50 to-stone-50">
      <Suspense fallback={<ServicesFallback />}>
        <ServicesBrowser />
      </Suspense>
    </main>
  )
}
