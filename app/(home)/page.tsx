import { CategoriesShowcase } from "@/components/home/categories-showcase"
import { Faq } from "@/components/home/faq"
import { FeaturedServices } from "@/components/home/featured-services"
import { Hero } from "@/components/home/hero"
import { HowItWorks } from "@/components/home/how-it-works"
import { StatsBand } from "@/components/home/stats-band"
import { TechnicianCta } from "@/components/home/technician-cta"
import { Testimonials } from "@/components/home/testimonials"
import { DEMO_SERVICES } from "@/lib/demo-data"
import { getFeaturedServices } from "@/lib/services/api"

export const metadata = {
  title: "FixMate | Get it fixed by verified technicians",
  description:
    "Find approved repair services, send a request in a minute, and pay only after the job is done.",
}

export default async function HomePage() {
  const services = await getFeaturedServices()

  return (
    <>
      <main>
        <Hero />
        <StatsBand />
        <FeaturedServices services={services} />
        <HowItWorks />
        <CategoriesShowcase />
        <Testimonials />
        <TechnicianCta />
        <Faq />
      </main>
    </>
  )
}
