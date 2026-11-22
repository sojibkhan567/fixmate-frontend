import { Footer } from "@/components/home/footer"
import { Navbar } from "@/components/home/nav-bar"

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
