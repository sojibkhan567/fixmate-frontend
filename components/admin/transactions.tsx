"use client"

import { useCallback, useEffect, useState } from "react"
import { Banknote, Receipt } from "lucide-react"
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
import { TransactionId } from "@/components/payments/payment-history"
import { getAdminTransactions, type Payment } from "@/lib/services/api"
import { formatMoney } from "@/lib/utils"

const fmtDateTime = (d: string) =>
  new Date(d).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

type Data = { payments: Payment[]; totalRevenue: number; count: number }

export function Transactions() {
  const [data, setData] = useState<Data | null>(null)
  const [failed, setFailed] = useState(false)

  const load = useCallback(async () => {
    setFailed(false)
    try {
      setData(await getAdminTransactions())
    } catch {
      setFailed(true)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  let content: React.ReactNode

  if (failed) {
    content = (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <p className="text-muted-foreground">
          We couldn&apos;t load the transactions.
        </p>
        <Button variant="outline" onClick={load}>
          Try again
        </Button>
      </div>
    )
  } else if (!data) {
    content = (
      <div className="space-y-3 p-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    )
  } else if (data.payments.length === 0) {
    content = (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Receipt className="size-6" />
        </span>
        <p className="font-medium">No transactions yet</p>
        <p className="text-sm text-muted-foreground">
          Completed payments will appear here.
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
                  "Technician",
                  "Service",
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
              {data.payments.map((p) => (
                <TableRow key={p._id} className="hover:bg-amber-50/40">
                  <TableCell className="py-4">
                    <p className="font-medium">{p.customerName}</p>
                    <p
                      className="max-w-44 truncate text-xs text-muted-foreground"
                      title={p.customerEmail}
                    >
                      {p.customerEmail}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{p.technicianName ?? "—"}</p>
                    <p
                      className="max-w-44 truncate text-xs text-muted-foreground"
                      title={p.technicianEmail ?? ""}
                    >
                      {p.technicianEmail}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-44 truncate" title={p.serviceTitle}>
                      {p.serviceTitle}
                    </p>
                  </TableCell>
                  <TableCell className="font-semibold whitespace-nowrap text-amber-800">
                    {formatMoney(p.amount)}
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

        {/* Mobile / tablet cards */}
        <ul className="divide-y divide-amber-100 lg:hidden">
          {data.payments.map((p) => (
            <li key={p._id} className="space-y-2.5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium" title={p.serviceTitle}>
                    {p.serviceTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.customerName} → {p.technicianName ?? "—"}
                  </p>
                </div>
                <span className="shrink-0 font-semibold text-amber-800">
                  {formatMoney(p.amount)}
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
      <header className="border-b border-amber-100 px-5 py-4">
        <h2 className="text-lg font-semibold tracking-tight">Transactions</h2>
        <p className="text-sm text-muted-foreground">
          Every payment received on the platform.
        </p>
      </header>

      {/* Total revenue (summed by the API) */}
      <div className="border-b border-amber-100 bg-amber-50/60 px-5 py-5">
        <div className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-amber-950">
            <Banknote className="size-6" />
          </span>
          <div className="leading-tight">
            <p className="text-xs font-medium tracking-wider text-amber-900/80 uppercase">
              Total revenue
            </p>
            {data ? (
              <p className="mt-1 text-3xl font-semibold tracking-tight text-amber-950">
                {formatMoney(data.totalRevenue)}
              </p>
            ) : (
              <Skeleton className="mt-1 h-9 w-40" />
            )}
            {data && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                from {data.count}{" "}
                {data.count === 1 ? "transaction" : "transactions"}
              </p>
            )}
          </div>
        </div>
      </div>

      {content}
    </section>
  )
}
