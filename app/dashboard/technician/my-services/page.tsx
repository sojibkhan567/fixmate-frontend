import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { MyServicesTable } from "@/components/services/my-services-table"
import { getTokenFromServer } from "@/lib/getTokenFromServer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Services | FixMate Application",
  description: "The official services booking website.",
}

export default async function MyServicesPage() {
  const token = await getTokenFromServer()
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/technician/my-services`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  )
  if (!res.ok) {
    console.log("API: ", res)
  }

  const data = await res.json()
  const services = Array.isArray(data)
    ? data
    : (data.data ?? data.services ?? [])
  return (
    <main className="container space-y-6 px-10 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My services</h1>
          <p className="text-sm text-muted-foreground">
            Edit, hide or remove the services you offer.
          </p>
        </div>
        <Link
          href="/dashboard/technician/add-services"
          className={buttonVariants()}
        >
          Add service
        </Link>
      </div>

      {/* Pass initial={[]} to preview the empty state */}
      <MyServicesTable services={services} />
    </main>
  )
}
