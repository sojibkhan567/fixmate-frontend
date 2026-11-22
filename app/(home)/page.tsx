import { CategoriesShowcase } from "@/components/home/categories-showcase"
import { Faq } from "@/components/home/faq"
import { FeaturedServices } from "@/components/home/featured-services"
import { Hero } from "@/components/home/hero"
import { HowItWorks } from "@/components/home/how-it-works"
import { StatsBand } from "@/components/home/stats-band"
import { TechnicianCta } from "@/components/home/technician-cta"
import { Testimonials } from "@/components/home/testimonials"
import { DEMO_SERVICES } from "@/lib/demo-data"

export default function Page() {
  //const live = await getFeaturedServices()
  // Demo data keeps the UI populated until the API returns real services.
  const services = DEMO_SERVICES
  return (
    <>
      {/* <HeroSlider /> */}

      <Hero />
      <StatsBand />
      <FeaturedServices services={services} />
      <HowItWorks />
      <CategoriesShowcase />
      <Testimonials />
      <TechnicianCta />
      <Faq />
    </>
  )
}
