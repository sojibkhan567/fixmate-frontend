"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Check, Copy, Receipt } from "lucide-react"
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
import { getMyPayments, type Payment } from "@/lib/services/api"

const money = (n?: number) => `৳${Number(n ?? 0).toLocaleString()}`
const fmtDateTime = (d: string) =>
  new Date(d).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

/** Transaction id (monospace, truncated) with a copy button */
function TransactionId({ id }: { id: string | null }) {
  const [copied, setCopied] = useState(false)
  if (!id) return <span className="text-muted-foreground">—</span>

  async function copy() {
    try {
      await navigator.clipboard.writeText(id!)
      setCopied(true)
      toast.success("Transaction ID copied")
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("Couldn't copy")
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <code
        className="max-w-40 truncate rounded bg-amber-50 px-1.5 py-0.5 font-mono text-xs text-amber-950"
        title={id}
      >
        {id}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy transaction ID"
        className="rounded p-1 text-muted-foreground transition-colors hover:bg-amber-100 hover:text-amber-900"
      >
        {copied ? (
          <Check className="size-3.5 text-emerald-600" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </div>
  )
}

export function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[] | null>(null)
  const [failed, setFailed] = useState(false)

  const load = useCallback(async () => {
    setFailed(false)
    try {
      setPayments(await getMyPayments())
    } catch {
      setFailed(true)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const total = useMemo(
    () => (payments ?? []).reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [payments]
  )

  let content: React.ReactNode

  if (failed) {
    content = (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <p className="text-muted-foreground">
          We couldn&apos;t load your payments.
        </p>
        <Button variant="outline" onClick={load}>
          Try again
        </Button>
      </div>
    )
  } else if (!payments) {
    content = (
      <div className="space-y-3 p-5">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    )
  } else if (payments.length === 0) {
    content = (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Receipt className="size-6" />
        </span>
        <p className="font-medium">No payments yet</p>
        <p className="text-sm text-muted-foreground">
          Payments for your completed repairs will appear here.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/dashboard/customer/bookings" />}
          variant="outline"
          size="sm"
          className="border-amber-300 hover:bg-amber-50"
        >
          Go to My Bookings
        </Button>
      </div>
    )
  } else {
    content = (
      <>
        {/* Desktop table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-amber-50/60 hover:bg-amber-50/60">
                {[
                  "Service",
                  "Technician",
                  "Amount",
                  "Transaction ID",
                  "Payment date",
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
              {payments.map((p) => (
                <TableRow key={p._id} className="hover:bg-amber-50/40">
                  <TableCell className="py-4">
                    <p
                      className="max-w-[16rem] truncate font-medium"
                      title={p.serviceTitle}
                    >
                      {p.serviceTitle}
                    </p>
                  </TableCell>
                  <TableCell>{p.technicianName ?? "—"}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-amber-800">
                      {money(p.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <TransactionId id={p.transactionId} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDateTime(p.paidAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <ul className="divide-y divide-amber-100 md:hidden">
          {payments.map((p) => (
            <li key={p._id} className="space-y-2.5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium" title={p.serviceTitle}>
                    {p.serviceTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.technicianName ?? "—"}
                  </p>
                </div>
                <span className="shrink-0 font-semibold text-amber-800">
                  {money(p.amount)}
                </span>
              </div>
              <TransactionId id={p.transactionId} />
              <p className="text-xs text-muted-foreground">
                {fmtDateTime(p.paidAt)}
              </p>
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <section className="overflow-hidden rounded-xl border border-amber-200 bg-card shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-100 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Payment history
          </h2>
          <p className="text-sm text-muted-foreground">
            {payments
              ? "Every repair you have paid for."
              : "Loading your payments…"}
          </p>
        </div>

        {payments && payments.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 px-3 py-1.5 text-right leading-tight">
              <p className="text-[11px] font-medium tracking-wider text-amber-900/80 uppercase">
                Total paid
              </p>
              <p className="text-lg font-semibold text-amber-950">
                {money(total)}
              </p>
            </div>
            <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">
              {payments.length} {payments.length === 1 ? "payment" : "payments"}
            </Badge>
          </div>
        )}
      </header>

      {content}
    </section>
  )
}
