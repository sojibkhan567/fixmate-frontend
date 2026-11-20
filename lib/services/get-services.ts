import type { Service } from "@/lib/services"
import { MODE_ITEMS, SORT_ITEMS } from "@/lib/services"

export interface ServiceFilters {
  search: string
  category: string
  mode: string
  sort: string
}

type RawParams = Record<string, string | string[] | undefined>

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v

/** Read + validate filters from the page URL. */
export function parseFilters(params: RawParams): ServiceFilters {
  const mode = first(params.mode) ?? "all"
  const sort = first(params.sort) ?? "newest"
  return {
    search: first(params.search)?.trim() ?? "",
    category: first(params.category) ?? "all",
    mode: MODE_ITEMS.some((m) => m.value === mode) ? mode : "all",
    sort: SORT_ITEMS.some((s) => s.value === sort) ? sort : "newest",
  }
}

/** Fetch approved + available services; filters/sort go in the API query. */
export async function getServices(f: ServiceFilters): Promise<Service[]> {
  const p = new URLSearchParams({
    approvalStatus: "approved",
    isAvailable: "true",
    sort: f.sort,
  })
  if (f.search) p.set("search", f.search)
  if (f.category !== "all") p.set("category", f.category)
  if (f.mode !== "all") p.set("serviceMode", f.mode)

  const url = `${process.env.NEXT_PUBLIC_API_URL}/services?${p.toString()}`

  // Timeout so a bad URL shows the error state instead of loading forever.
  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    throw new Error(`GET ${url} responded ${res.status}`)
  }
  const data = await res.json()
  return data.services ?? data
}
