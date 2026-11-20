import { ServiceFilters } from "@/components/services/service-filters"
import { ServicesTable } from "@/components/services/services-table"
import { getServices } from "@/lib/services/api"
import { parseStatus } from "@/types/services"

type SearchParams = Promise<{
  status?: string
  search?: string
  category?: string
}>

export default async function ServiceApprovalPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams

  const filters = {
    status: parseStatus(sp.status),
    search: (sp.search ?? "").trim(),
    category: sp.category || "all",
  }

  const services = await getServices(filters)

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Services</h1>
        <p className="text-sm text-muted-foreground">
          {services.length} service{services.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
        <ServiceFilters />
        <ServicesTable
          services={services}
          statusFilter={filters.status}
          hasFilters={!!filters.search || filters.category !== "all"}
        />
      </div>
    </div>
  )
}
