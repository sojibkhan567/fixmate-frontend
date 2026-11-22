"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { CheckCircle2, CreditCard, Loader2, X } from "lucide-react"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  cancelBooking,
  getMyBookings,
  startCheckout,
  verifyPayment,
} from "@/lib/bookings/api"
import { Booking, BookingStatus } from "@/types/bookings"
import { toast } from "sonner"
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
  cancelled: { label: "Cancelled", className: "bg-red-200 text-zinc-700" },
}

const fmtDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

export function MyBookings() {
  const [bookings, setBookings] = useState<Booking[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [payingId, setPayingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setFailed(false)
    try {
      setBookings(await getMyBookings())
    } catch {
      setFailed(true)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Returning from Stripe Checkout: confirm the payment, then refresh the list
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const payment = q.get("payment")
    if (!payment) return
    const booking = q.get("booking")
    const sessionId = q.get("session_id")
    window.history.replaceState(null, "", window.location.pathname)

    if (payment === "cancelled") {
      toast.info("Payment cancelled. You can pay anytime.")
      return
    }
    if (payment === "success" && booking && sessionId) {
      verifyPayment(booking, sessionId).then((paid) => {
        if (paid) toast.success("Payment received. Thank you!")
        else toast.info("We're confirming your payment. Refresh in a moment.")
        load()
      })
    }
  }, [load])

  // cancel booking
  async function confirmCancel() {
    if (!cancelTarget) return
    setCancelling(true)
    try {
      const res = await cancelBooking(cancelTarget._id)
      if (res.ok) {
        setBookings(
          (prev) =>
            prev?.map((b) =>
              b._id === cancelTarget._id ? { ...b, status: "cancelled" } : b
            ) ?? prev
        )
        toast.success("Booking cancelled")
      } else {
        toast.error(res.data.error ?? "Couldn't cancel this booking")
        load() // status may have changed (e.g. technician accepted)
      }
      setCancelTarget(null)
    } catch {
      toast.error("Network error. Try again.")
    } finally {
      setCancelling(false)
    }
  }

  // payment onClick method
  async function pay(b: Booking) {
    setPayingId(b._id)
    try {
      const res = await startCheckout(b._id)
      if (res.ok && res.data.url) {
        window.location.href = res.data.url
        return // keep the spinner while redirecting
      }
      toast.error(res.data.error ?? "Couldn't start payment")
    } catch {
      toast.error("Network error. Try again.")
    }
    setPayingId(null)
  }

  /* ---------- states ---------- */
  if (failed) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-amber-200 py-14 text-center">
        <p className="text-muted-foreground">
          We couldn&apos;t load your bookings.
        </p>
        <Button variant="outline" onClick={load}>
          Try again
        </Button>
      </div>
    )
  }

  if (!bookings) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 py-16 text-center">
        <p className="font-medium">No bookings yet</p>
        <p className="text-sm text-muted-foreground">
          Find a service and request your first repair.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/services" />}
          className="bg-amber-500 text-amber-950 hover:bg-amber-400"
        >
          Browse services
        </Button>
      </div>
    )
  }

  const Actions = ({ b }: { b: Booking }) => {
    if (b.status === "requested") {
      return (
        <Button variant="outline" size="sm" onClick={() => setCancelTarget(b)}>
          <X className="size-4" /> Cancel
        </Button>
      )
    }
    if (b.status === "completed" && b.paymentStatus === "unpaid") {
      return (
        <Button
          size="sm"
          disabled={payingId === b._id}
          onClick={() => pay(b)}
          className="bg-amber-500 text-amber-950 hover:bg-amber-400"
        >
          {payingId === b._id ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <CreditCard className="size-4" />
          )}
          Pay Now
        </Button>
      )
    }
    if (b.paymentStatus === "paid") {
      return (
        <Badge className="bg-emerald-100 text-emerald-900">
          <CheckCircle2 className="size-3.5" /> Paid
        </Badge>
      )
    }
    return <span className="text-sm text-muted-foreground">—</span>
  }

  const PaymentBadge = ({ b }: { b: Booking }) => (
    <Badge
      className={
        b.paymentStatus === "paid"
          ? "bg-emerald-100 text-emerald-900"
          : "bg-amber-200 text-zinc-700"
      }
    >
      {b.paymentStatus === "paid" ? "Paid" : "Unpaid"}
    </Badge>
  )

  const Amount = ({ b }: { b: Booking }) => (
    <div className="leading-tight">
      <p className="mb-1 text-sm text-muted-foreground">
        Base {formatMoney(b.basePrice)}
      </p>
      {b.finalAmount != null && (
        <p className="font-medium">Final {formatMoney(b.finalAmount)}</p>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-amber-200 bg-card p-4 md:block">
        <Table className="p-6">
          <TableHeader className="bg-amber-50">
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Service Title</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Preferred date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b._id}>
                <TableCell className="max-w-8">
                  <Link
                    href={`/services/${b.serviceId}`}
                    className="flex min-w-48 items-center gap-3 hover:underline"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.service.image}
                      alt=""
                      className="size-12 rounded-lg object-cover"
                    />
                  </Link>
                </TableCell>
                <TableCell className="max-w-40">
                  <p className="truncate font-medium">{b.service.title}</p>
                </TableCell>
                <TableCell>{b.technician.name ?? "—"}</TableCell>
                <TableCell>{fmtDate(b.preferredDate)}</TableCell>
                <TableCell>
                  <Amount b={b} />
                </TableCell>
                <TableCell>
                  <Badge className={STATUS[b.status].className}>
                    {STATUS[b.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <PaymentBadge b={b} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Actions b={b} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-3 md:hidden">
        {bookings.map((b) => (
          <li
            key={b._id}
            className="space-y-3 rounded-xl border border-amber-200 p-4"
          >
            <Link
              href={`/services/${b.serviceId}`}
              className="flex items-center gap-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.service.image}
                alt=""
                className="size-14 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-medium">{b.service.title}</p>
                <p className="text-sm text-muted-foreground">
                  {b.technician.name ?? "—"}
                </p>
              </div>
            </Link>
            <div className="flex flex-wrap gap-2">
              <Badge className={STATUS[b.status].className}>
                {STATUS[b.status].label}
              </Badge>
              <PaymentBadge b={b} />
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  {fmtDate(b.preferredDate)}
                </p>
                <Amount b={b} />
              </div>
              <Actions b={b} />
            </div>
          </li>
        ))}
      </ul>

      {/* Cancel confirmation */}
      <Dialog
        open={!!cancelTarget}
        onOpenChange={(o) => !o && !cancelling && setCancelTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel this request?</DialogTitle>
            <DialogDescription>
              {cancelTarget?.service.title} on{" "}
              {cancelTarget && fmtDate(cancelTarget.preferredDate)} will be
              cancelled. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={cancelling}
              onClick={() => setCancelTarget(null)}
            >
              Keep request
            </Button>
            <Button
              variant="destructive"
              disabled={cancelling}
              onClick={confirmCancel}
            >
              {cancelling && <Loader2 className="size-4 animate-spin" />}
              Yes, cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
