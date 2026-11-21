"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SearchX, Wrench, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import { useServices } from "@/hooks/use-services"
import { ServiceCard } from "./service-card"
import { ServiceCardSkeleton } from "./service-card-skeleton"
import { ServicesFilters } from "./services-filters"
import { StateMessage } from "./state-message"

const DEFAULT_SORT = "newest"

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  )
}

export function ServicesBrowser() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // The URL is the source of truth for filters, so links are shareable
  // and the back/forward buttons work.
  const urlSearch = searchParams.get("search") ?? ""
  const category = searchParams.get("category") ?? "all"
  const mode = searchParams.get("mode") ?? "all"
  const sort = searchParams.get("sort") ?? DEFAULT_SORT

  // The input keeps its own state so typing stays instant.
  const [searchInput, setSearchInput] = useState(urlSearch)
  const debouncedSearch = useDebounce(searchInput)
  const lastPushedSearch = useRef(urlSearch)

  const updateParams = useCallback(
    (updates: Record<string, string>, method: "push" | "replace" = "push") => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        const isDefault =
          value === "" ||
          (key === "sort" ? value === DEFAULT_SORT : value === "all")
        if (isDefault) params.delete(key)
        else params.set(key, value)
      }
      const qs = params.toString()
      router[method](qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  // Typing -> URL (debounced).
  useEffect(() => {
    const next = debouncedSearch.trim()
    if (next === urlSearch) return
    lastPushedSearch.current = next
    updateParams({ search: next }, "replace")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  // Back/forward or a pasted link -> input.
  useEffect(() => {
    if (urlSearch !== lastPushedSearch.current) {
      lastPushedSearch.current = urlSearch
      setSearchInput(urlSearch)
    }
  }, [urlSearch])

  // The API query is built from the URL, so what you see matches the link.
  const queryString = useMemo(() => {
    const p = new URLSearchParams({
      approvalStatus: "approved",
      isAvailable: "true",
      sort,
    })
    if (urlSearch) p.set("search", urlSearch)
    if (category !== "all") p.set("category", category)
    if (mode !== "all") p.set("serviceMode", mode)
    return p.toString()
  }, [urlSearch, category, mode, sort])

  const { services, loading, error, retry } = useServices(queryString)

  const hasFilters = !!searchInput || category !== "all" || mode !== "all"
  const clearAll = () => {
    lastPushedSearch.current = ""
    setSearchInput("")
    // keep the chosen sort, drop everything else
    updateParams({ search: "", category: "all", mode: "all" })
  }

  return (
    <>
      <section className="border-b border-amber-200/60 bg-amber-100/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
            <Wrench className="size-4" />
            Trusted local technicians
          </div>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Find the right fix, close to home.
          </h1>
          <p className="mt-3 max-w-xl text-base text-stone-600 sm:text-lg">
            Browse approved services from verified technicians. Book a visit at
            your door or drop your device at their shop.
          </p>

          <div className="mt-8">
            <ServicesFilters
              search={searchInput}
              category={category}
              mode={mode}
              sort={sort}
              onSearchChange={setSearchInput}
              onCategoryChange={(v) => updateParams({ category: v })}
              onModeChange={(v) => updateParams({ mode: v })}
              onSortChange={(v) => updateParams({ sort: v })}
            />
          </div>
          {/** list ot card */}
          <div className="mt-6 mb-4 flex min-h-8 items-center justify-between gap-3">
            {loading ? (
              "Loading services…"
            ) : error ? (
              ""
            ) : (
              <h1 className="text-sm text-stone-600" aria-live="polite">
                Showing Total{" "}
                <span className="text-[15px] font-bold">{services.length}</span>{" "}
                {services.length === 1 ? "Service." : "Services."}`
              </h1>
            )}

            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-amber-800 hover:bg-amber-100 hover:text-amber-900"
              >
                <X className="size-4" />
                Clear filters
              </Button>
            )}
          </div>

          {error ? (
            <StateMessage
              icon={<Wrench className="size-7" />}
              title="Something went wrong"
              body={error}
              action={
                <Button
                  onClick={retry}
                  className="bg-amber-500 text-stone-900 hover:bg-amber-400"
                >
                  Try again
                </Button>
              }
            />
          ) : loading ? (
            <Grid>
              {Array.from({ length: 8 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </Grid>
          ) : services.length === 0 ? (
            <StateMessage
              icon={<SearchX className="size-7" />}
              title="No services match your search"
              body="Try a different keyword, or remove a filter to see more technicians near you."
              action={
                hasFilters && (
                  <Button
                    onClick={clearAll}
                    className="bg-amber-500 text-stone-900 hover:bg-amber-400"
                  >
                    Clear all filters
                  </Button>
                )
              }
            />
          ) : (
            <Grid>
              {services.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </Grid>
          )}
        </div>
      </section>
    </>
  )
}
