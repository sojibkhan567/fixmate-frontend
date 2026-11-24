"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Check, CheckCheck, Loader2, Play, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getTechnicianRequests, updateBookingStatus } from "@/lib/services/api"
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

type Filter = "all" | "requested" | "accepted" | "inprogress" | "completed"
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "inprogress", label: "In Progress" },
  { key: "completed", label: "Completed" },
]

const fmtDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

export function ManageRequests() {
  const [bookings, setBookings] = useState<Booking[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [filter, setFilter] = useState<Filter>("all")
  const [busyId, setBusyId] = useState<string | null>(null)

  const [rejectTarget, setRejectTarget] = useState<Booking | null>(null)
  const [completeTarget, setCompleteTarget] = useState<Booking | null>(null)
  const [amount, setAmount] = useState("")
  const [amountError, setAmountError] = useState("")
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setFailed(false)
    try {
      setBookings(await getTechnicianRequests())
    } catch {
      setFailed(true)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: 0,
      requested: 0,
      accepted: 0,
      inprogress: 0,
      completed: 0,
    }
    for (const b of bookings ?? []) {
      c.all++
      if (b.status in c) c[b.status as Filter]++
    }
    return c
  }, [bookings])

  const visible = useMemo(
    () =>
      (bookings ?? []).filter((b) => filter === "all" || b.status === filter),
    [bookings, filter]
  )

  /** Runs one status change and updates the row in place */
  async function change(
    b: Booking,
    status: "accepted" | "rejected" | "inprogress" | "completed",
    finalAmount?: number
  ) {
    setBusyId(b._id)
    try {
      const res = await updateBookingStatus(b._id, status, finalAmount)
      if (res.ok) {
        setBookings(
          (prev) =>
            prev?.map((x) =>
              x._id === b._id
                ? { ...x, status, ...(finalAmount != null && { finalAmount }) }
                : x
            ) ?? prev
        )
        const done = {
          accepted: "Request accepted",
          rejected: "Request rejected",
          inprogress: "Work started",
          completed: "Marked as completed",
        }[status]
        toast.success(done)
        return true
      }
      toast.error(
        res.data.error ?? res.data.message ?? "Couldn't update this request"
      )
      load() // the status may have changed (e.g. the customer cancelled)
      return false
    } catch {
      toast.error("Network error. Try again.")
      return false
    } finally {
      setBusyId(null)
    }
  }

  function openComplete(b: Booking) {
    setCompleteTarget(b)
    setAmount(String(b.finalAmount ?? b.basePrice ?? ""))
    setAmountError("")
  }

  async function submitComplete() {
    if (!completeTarget) return
    const value = Number(amount)
    if (!amount.trim() || !Number.isFinite(value) || value <= 0) {
      setAmountError("Enter an amount greater than 0")
      return
    }
    setSaving(true)
    const ok = await change(completeTarget, "completed", value)
    setSaving(false)
    if (ok) setCompleteTarget(null)
  }

  async function confirmReject() {
    if (!rejectTarget) return
    setSaving(true)
    await change(rejectTarget, "rejected")
    setSaving(false)
    setRejectTarget(null)
  }

  /* ---------- row pieces ---------- */
  const Actions = ({ b }: { b: Booking }) => {
    const busy = busyId === b._id
    switch (b.status) {
      case "requested":
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={busy}
              onClick={() => change(b, "accepted")}
              className="bg-amber-500 text-amber-950 hover:bg-amber-400"
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => setRejectTarget(b)}
            >
              <X className="size-4" /> Reject
            </Button>
          </div>
        )
      case "accepted":
        return (
          <Button
            size="sm"
            disabled={busy}
            onClick={() => change(b, "inprogress")}
            className="bg-amber-500 text-amber-950 hover:bg-amber-400"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Play className="size-4" />
            )}
            Start Work
          </Button>
        )
      case "inprogress":
        return (
          <Button
            size="sm"
            disabled={busy}
            onClick={() => openComplete(b)}
            className="bg-amber-500 text-amber-950 hover:bg-amber-400"
          >
            <CheckCheck className="size-4" /> Mark Completed
          </Button>
        )
      case "completed":
        return (
          <Badge
            className={
              b.paymentStatus === "paid"
                ? "bg-emerald-100 text-emerald-900"
                : "bg-zinc-100 text-zinc-700"
            }
          >
            {b.paymentStatus === "paid" ? "Paid" : "Payment pending"}
          </Badge>
        )
      default:
        return <span className="text-sm text-muted-foreground">—</span>
    }
  }

  const StatusBadge = ({ b }: { b: Booking }) => (
    <Badge className={`gap-1.5 ${STATUS[b.status].className}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {STATUS[b.status].label}
    </Badge>
  )

  const initials = (name?: string) =>
    (name ?? "?")
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()

  /* ---------- body (changes with load state) ---------- */
  let content: React.ReactNode

  if (failed) {
    content = (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <p className="text-muted-foreground">
          We couldn&apos;t load your requests.
        </p>
        <Button variant="outline" onClick={load}>
          Try again
        </Button>
      </div>
    )
  } else if (!bookings) {
    content = (
      <div className="space-y-3 p-5">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    )
  } else if (visible.length === 0) {
    content = (
      <div className="py-16 text-center">
        <p className="font-medium">No requests here</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {filter === "all"
            ? "New repair requests for your services will appear here."
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
                  "Customer",
                  "Service",
                  "Phone",
                  "Address",
                  "Preferred date",
                  "Status",
                ].map((h) => (
                  <TableHead
                    key={h}
                    className="h-11 text-xs font-semibold tracking-wider text-amber-900/80 uppercase"
                  >
                    {h}
                  </TableHead>
                ))}
                <TableHead className="h-11 text-right text-xs font-semibold tracking-wider text-amber-900/80 uppercase">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((b) => (
                <TableRow key={b._id} className="hover:bg-amber-50/40">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-900"
                      >
                        {initials(b.customer?.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium">{b.customer?.name}</p>
                        <p
                          className="max-w-44 truncate text-xs text-muted-foreground"
                          title={b.customer?.email}
                        >
                          {b.customer?.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <p
                      className="max-w-44 truncate font-medium"
                      title={b.service?.title}
                    >
                      {b.service?.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.status === "completed"
                        ? `Final ${formatMoney(b.finalAmount)}`
                        : `Base ${formatMoney(b.basePrice)}`}
                    </p>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">{b.phone}</TableCell>

                  <TableCell>
                    <p className="max-w-44 truncate" title={b.address}>
                      {b.address}
                    </p>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {fmtDate(b.preferredDate)}
                  </TableCell>

                  <TableCell>
                    <StatusBadge b={b} />
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end">
                      <Actions b={b} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile / tablet cards */}
        <ul className="divide-y divide-amber-100 lg:hidden">
          {visible.map((b) => (
            <li key={b._id} className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium" title={b.service?.title}>
                    {b.service?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {b.status === "completed"
                      ? `Final ${formatMoney(b.finalAmount)}`
                      : `Base ${formatMoney(b.basePrice)}`}
                  </p>
                </div>
                <StatusBadge b={b} />
              </div>

              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                <dt className="text-muted-foreground">Customer</dt>
                <dd>{b.customer?.name}</dd>
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{b.phone}</dd>
                <dt className="text-muted-foreground">Address</dt>
                <dd>{b.address}</dd>
                <dt className="text-muted-foreground">Date</dt>
                <dd>{fmtDate(b.preferredDate)}</dd>
                <dt className="text-muted-foreground">Problem</dt>
                <dd>{b.problemDescription}</dd>
              </dl>

              <div className="flex justify-end">
                <Actions b={b} />
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <section className="overflow-hidden rounded-xl border border-amber-200 bg-card shadow-sm">
      {/* Section title + filter */}
      <header className="space-y-4 border-b border-amber-100 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Repair requests
          </h2>
          <p className="text-sm text-muted-foreground">
            {bookings
              ? `${counts.all} total · ${counts.requested} awaiting your response`
              : "Loading your requests…"}
          </p>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by status"
        >
          {FILTERS.map(({ key, label }) => {
            const active = filter === key
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                  active
                    ? "border-amber-500 bg-amber-500 text-amber-950"
                    : "border-amber-200 bg-background hover:bg-amber-50"
                }`}
              >
                {label}
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    active ? "bg-amber-950/15" : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {counts[key]}
                </span>
              </button>
            )
          })}
        </div>
      </header>

      {content}

      {/* Mark completed: final amount */}
      <Dialog
        open={!!completeTarget}
        onOpenChange={(o) => !o && !saving && setCompleteTarget(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Mark as completed</DialogTitle>
            <DialogDescription>
              {completeTarget?.service?.title} for{" "}
              {completeTarget?.customer?.name}. The customer will pay the amount
              below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="finalAmount">Final amount ($)</Label>
            <Input
              id="finalAmount"
              type="number"
              inputMode="decimal"
              min={1}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setAmountError("")
              }}
              aria-invalid={!!amountError}
            />
            {amountError ? (
              <p className="text-sm text-destructive">{amountError}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Base price: {formatMoney(completeTarget?.basePrice as number)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => setCompleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              disabled={saving}
              onClick={submitComplete}
              className="bg-amber-500 text-amber-950 hover:bg-amber-400"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              Mark completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject confirmation */}
      <Dialog
        open={!!rejectTarget}
        onOpenChange={(o) => !o && !saving && setRejectTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject this request?</DialogTitle>
            <DialogDescription>
              {rejectTarget?.customer?.name}&apos;s request for{" "}
              {rejectTarget?.service?.title} will be rejected and the service
              becomes available to others. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => setRejectTarget(null)}
            >
              Keep request
            </Button>
            <Button
              variant="destructive"
              disabled={saving}
              onClick={confirmReject}
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              Yes, reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
