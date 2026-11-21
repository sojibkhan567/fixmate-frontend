// lib/services/types.ts
// Safe to import from both server and client code.

export type ApprovalStatus = "pending" | "approved" | "rejected"
export type StatusFilter = ApprovalStatus | "all"

export type ServiceCategory =
  | "Smartphone"
  | "Laptop & PC"
  | "AC"
  | "Refrigerator"
  | "TV"
  | "Washing Machine"
  | "Electrical"

export type ServiceMode = "Home Visit" | "Shop Drop-off"

// export type Technician = {
//   name: string
//   image?: string
//   area?: string
//   bio?: string
// }

export interface Technician {
  id: string
  name: string
  email: string
  image?: string
  bio?: string
  area?: string
  phone?: string
  [key: string]: unknown
}

export interface Service {
  _id: string
  title: string
  category: ServiceCategory
  description: string
  basePrice: number
  estimatedDuration: string
  image: string
  isAvailable: boolean
  serviceArea: string
  serviceMode: ServiceMode
  technicianEmail: string
  technicianName: string
  approvalStatus: ApprovalStatus
  technician?: Technician
  updatedAt: string
  createdAt: string
}

export type ServiceFilters = {
  status: StatusFilter
  search: string
  category: string // "all" or a category name
}

export const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const

export const DEFAULT_STATUS: StatusFilter = "pending" // pending shown by default

export const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All Status" },
]

export function parseStatus(value: string | null | undefined): StatusFilter {
  return STATUS_OPTIONS.some((o) => o.value === value)
    ? (value as StatusFilter)
    : DEFAULT_STATUS
}

// In the "All Status" view, pending services come first, newest first
const ORDER: Record<ApprovalStatus, number> = {
  pending: 0,
  rejected: 1,
  approved: 2,
}

export function sortPendingFirst(list: Service[]): Service[] {
  return [...list].sort(
    (a, b) =>
      ORDER[a.approvalStatus] - ORDER[b.approvalStatus] ||
      new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
  )
}

export const formatPrice = (p?: number) =>
  typeof p === "number" ? `BDT ${p.toLocaleString()}` : "—"

export const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString(undefined, { dateStyle: "medium" }) : "—"
