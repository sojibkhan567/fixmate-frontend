"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getAdminBookings,
  type BookingCounts,
  type BookingFilter,
} from "@/lib/services/api"
import { Booking, BookingStatus } from "@/types/bookings"
import { formatMoney } from "@/lib/utils"

const STATUS: Record<BookingStatus, { label: string; className: string }> = {
  requested: { label: "Requested", className: "bg-amber-100 text-amber-900" },
  accepted: { label: "Accepted", className: "bg-sky-100 text-sky-900" },
  inprogress: {
    label: "In Progress",
    className: "bg-violet-100 text-violet-900",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-900",
  },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-900" },
  cancelled: { label: "Cancelled", className: "bg-zinc-200 text-zinc-700" },
}

const FILTERS: { key: BookingFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "inprogress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "rejected", label: "Rejected" },
  { key: "cancelled", label: "Cancelled" },
]

const money = (n?: number | null) => `৳${Number(n ?? 0).toLocaleString()}`
const fmtDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
// Completed jobs show the final amount; everything else shows the base price
const amountOf = (b: Booking) =>
  b.status === "completed" ? b.finalAmount : b.basePrice

export function AllBookings() {
  const [status, setStatus] = useState<BookingFilter>("all")
  const [bookings, setBookings] = useState<Booking[] | null>(null)
  const [counts, setCounts] = useState<BookingCounts | null>(null)
  const [failed, setFailed] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  // The filter is sent to the API as ?status=...; the server returns only matching bookings
  useEffect(() => {
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBookings(null)
    setFailed(false)
    getAdminBookings(status)
      .then((data) => {
        if (cancelled) return
        setBookings(data.bookings)
        setCounts(data.counts)
      })
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true // ignore a slow response from a previous filter
    }
  }, [status, reloadKey])

  const StatusBadge = ({ b }: { b: Booking }) => (
    <Badge className={`gap-1.5 ${STATUS[b.status].className}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {STATUS[b.status].label}
    </Badge>
  )

  const PaymentBadge = ({ b }: { b: Booking }) => (
    <Badge
      className={
        b.paymentStatus === "paid"
          ? "bg-emerald-100 text-emerald-900"
          : "bg-zinc-100 text-zinc-700"
      }
    >
      {b.paymentStatus === "paid" ? "Paid" : "Unpaid"}
    </Badge>
  )

  const Thumb = ({ b, className }: { b: Booking; className: string }) =>
    b.service?.image ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={b.service.image}
        alt=""
        className={`${className} shrink-0 rounded-lg object-cover`}
      />
    ) : (
      <span className={`${className} shrink-0 rounded-lg bg-amber-100`} />
    )

  let content: React.ReactNode

  if (failed) {
    content = (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <p className="text-muted-foreground">
          We couldn&apos;t load the bookings.
        </p>
        <Button variant="outline" onClick={() => setReloadKey((k) => k + 1)}>
          Try again
        </Button>
      </div>
    )
  } else if (!bookings) {
    content = (
      <div className="space-y-3 p-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    )
  } else if (bookings.length === 0) {
    content = (
      <div className="py-16 text-center">
        <p className="font-medium">No bookings here</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {status === "all"
            ? "No bookings have been made yet."
            : "Nothing matches this status right now."}
        </p>
      </div>
    )
  } else {
    content = (
      <>
        {/* Desktop table */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-amber-50/60 hover:bg-amber-50/60">
                {[
                  "Service",
                  "Customer",
                  "Technician",
                  "Date",
                  "Status",
                  "Payment",
                  "Amount",
                ].map((h) => (
                  <TableHead
                    key={h}
                    className="h-11 text-xs font-semibold tracking-wider text-amber-900/80 uppercase"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b._id} className="hover:bg-amber-50/40">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Thumb b={b} className="size-11" />
                      <p
                        className="max-w-48 truncate font-medium"
                        title={b.service?.title}
                      >
                        {b.service?.title}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{b.customer?.name}</p>
                    <p
                      className="max-w-48 truncate text-xs text-muted-foreground"
                      title={b.customer?.email}
                    >
                      {b.customer?.email}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{b.technician?.name ?? "—"}</p>
                    <p
                      className="max-w-48 truncate text-xs text-muted-foreground"
                      title={b.technician?.email ?? ""}
                    >
                      {b.technician?.email}
                    </p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {fmtDate(b.preferredDate)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge b={b} />
                  </TableCell>
                  <TableCell>
                    <PaymentBadge b={b} />
                  </TableCell>
                  <TableCell className="font-semibold whitespace-nowrap text-amber-800">
                    {formatMoney(amountOf(b))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile / tablet cards */}
        <ul className="divide-y divide-amber-100 lg:hidden">
          {bookings.map((b) => (
            <li key={b._id} className="space-y-3 p-4">
              <div className="flex items-start gap-3">
                <Thumb b={b} className="size-12" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium" title={b.service?.title}>
                    {b.service?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fmtDate(b.preferredDate)}
                  </p>
                </div>
                <span className="shrink-0 font-semibold text-amber-800">
                  {money(amountOf(b))}
                </span>
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <dt className="text-muted-foreground">Customer</dt>
                <dd>{b.customer?.name}</dd>
                <dt className="text-muted-foreground">Technician</dt>
                <dd>{b.technician?.name ?? "—"}</dd>
              </dl>
              <div className="flex gap-2">
                <StatusBadge b={b} />
                <PaymentBadge b={b} />
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <section className="overflow-hidden rounded-xl border border-amber-200 bg-card shadow-sm">
      <header className="space-y-4 border-b border-amber-100 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">All bookings</h2>
          <p className="text-sm text-muted-foreground">
            {counts
              ? `${counts.all} bookings on the platform`
              : "Loading bookings…"}
          </p>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by status"
        >
          {FILTERS.map(({ key, label }) => {
            const active = status === key
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setStatus(key)}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                  active
                    ? "border-amber-500 bg-amber-500 text-amber-950"
                    : "border-amber-200 bg-background hover:bg-amber-50"
                }`}
              >
                {label}
                {counts && (
                  <span
                    className={`rounded-full px-1.5 text-xs ${
                      active ? "bg-amber-950/15" : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {counts[key]}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </header>

      {content}
    </section>
  )
}
