import { Home, Store } from "lucide-react"

export type ServiceMode = "home_visit" | "shop_dropoff"

export interface Service {
  _id: string
  title: string
  category: string
  serviceMode: ServiceMode
  serviceArea: string
  startingPrice: number
  image?: string // or images[0]
  technician?: { name: string } | null
}

export const CATEGORY_ITEMS = [
  { value: "all", label: "All categories" },
  { value: "AC", label: "AC Repair" },
  { value: "Electrical", label: "Electrical" },
  { value: "Plumbing", label: "Plumbing" },
  { value: "Appliance Repair", label: "Appliance Repair" },
  { value: "Mobile & Laptop", label: "Mobile & Laptop" },
  { value: "Cleaning", label: "Cleaning" },
]

export const MODE_ITEMS = [
  { value: "all", label: "Any service mode" },
  { value: "Home Visit", label: "Home Visit" },
  { value: "Shop Drop-off", label: "Shop Drop-off" },
]

export const SORT_ITEMS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
]

export const MODE_META: Record<
  ServiceMode,
  { label: string; icon: typeof Home }
> = {
  home_visit: { label: "Home Visit", icon: Home },
  shop_dropoff: { label: "Shop Drop-off", icon: Store },
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(n)
