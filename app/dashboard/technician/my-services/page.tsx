import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { MyServicesTable } from "@/components/services/my-services-table"

import { API_BASE_URL } from "@/lib/api/config"
import { getTokenFromServer } from "@/lib/getTokenFromServer"
import { toast } from "react-toastify"

// app/dashboard/technician/my-services/page.tsx
export default async function MyServicesPage() {
  let services = []

  try {
    const token = await getTokenFromServer()

    const res = await fetch(`${API_BASE_URL}/services`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch services")
    }

    services = data.data || []
  } catch (error) {
    toast.error("Failed to fetch services.")
    console.log(error)
    services = []
  }

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
