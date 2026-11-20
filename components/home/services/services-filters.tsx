import type { ReactNode } from "react"
import { ArrowUpDown, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORY_ITEMS, MODE_ITEMS, SORT_ITEMS } from "@/lib/services"

interface ServicesFiltersProps {
  search: string
  category: string
  mode: string
  sort: string
  onSearchChange: (v: string) => void
  onCategoryChange: (v: string) => void
  onModeChange: (v: string) => void
  onSortChange: (v: string) => void
}

type Item = { value: string; label: string }

// Base UI's Select needs `items` so <SelectValue /> shows the label
// (not the raw value) for the selected option.
function FilterSelect({
  items,
  value,
  onChange,
  label,
  className,
  icon,
}: {
  items: Item[]
  value: string
  onChange: (v: string) => void
  label: string
  className?: string
  icon?: ReactNode
}) {
  return (
    <Select
      items={items}
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as string)
      }}
    >
      <SelectTrigger
        aria-label={label}
        className={`h-11 w-full focus-visible:border-amber-500 focus-visible:ring-amber-500/30 ${className ?? ""}`}
      >
        {icon}
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((i) => (
          <SelectItem key={i.value} value={i.value}>
            {i.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function ServicesFilters(props: ServicesFiltersProps) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-3 shadow-sm shadow-amber-900/5">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-amber-700" />
          <Input
            value={props.search}
            onChange={(e) => props.onSearchChange(e.target.value)}
            placeholder="Search services, e.g. “AC servicing”"
            aria-label="Search services"
            className="h-11 border-stone-200 pl-9 focus-visible:border-amber-500 focus-visible:ring-amber-500/30"
          />
        </div>

        <FilterSelect
          items={CATEGORY_ITEMS}
          value={props.category}
          onChange={props.onCategoryChange}
          label="Category"
          className="lg:w-44"
        />
        <FilterSelect
          items={MODE_ITEMS}
          value={props.mode}
          onChange={props.onModeChange}
          label="Service mode"
          className="lg:w-44"
        />
        <FilterSelect
          items={SORT_ITEMS}
          value={props.sort}
          onChange={props.onSortChange}
          label="Sort services"
          className="lg:w-52"
          icon={<ArrowUpDown className="size-4 text-amber-700" />}
        />
      </div>
    </div>
  )
}
