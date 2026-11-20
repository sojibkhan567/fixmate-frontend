"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Loader2, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CATEGORIES,
  DEFAULT_STATUS,
  parseStatus,
  STATUS_OPTIONS,
  type StatusFilter,
} from "@/types/services"

export function ServiceFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const status = parseStatus(searchParams.get("status"))
  const category = searchParams.get("category") ?? "all"
  const currentSearch = searchParams.get("search") ?? ""
  const [searchInput, setSearchInput] = useState(currentSearch)

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(patch).forEach(([key, value]) =>
        value === null ? params.delete(key) : params.set(key, value)
      )
      const qs = params.toString()
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
      })
    },
    [router, pathname, searchParams]
  )

  // Debounce the search box so we don't hit the backend on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = searchInput.trim()
      if (trimmed !== currentSearch) update({ search: trimmed || null })
    }, 300)
    return () => clearTimeout(t)
  }, [searchInput, currentSearch, update])

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by service or technician…"
          aria-label="Search services"
          className="h-10 pr-9 pl-9"
        />
        {isPending && (
          <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      <Select
        value={category}
        onValueChange={(v) => update({ category: v === "all" ? null : v })}
      >
        <SelectTrigger
          className="h-10 w-full sm:w-44"
          aria-label="Filter by category"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={status}
        onValueChange={(v) =>
          update({ status: (v as StatusFilter) === DEFAULT_STATUS ? null : v })
        }
      >
        <SelectTrigger
          className="h-10 w-full sm:w-36"
          aria-label="Filter by approval status"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
