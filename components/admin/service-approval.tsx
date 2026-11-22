"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Check, Loader2, X } from "lucide-react"
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
import { getAdminServices, setServiceApproval } from "@/lib/services/api"
import { Service } from "@/types/services"
import { formatMoney } from "@/lib/utils"

type Status = "pending" | "approved" | "rejected"
type Filter = Status | "all"

const STATUS: Record<Status, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-900" },
  approved: { label: "Approved", className: "bg-emerald-100 text-emerald-900" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-900" },
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
]

const ORDER: Record<Status, number> = { pending: 0, approved: 1, rejected: 2 }
const statusOf = (s: Service): Status =>
  (["pending", "approved", "rejected"].includes(s.approvalStatus)
    ? s.approvalStatus
    : "pending") as Status

const money = (n?: number) => `৳${Number(n ?? 0).toLocaleString()}`
const fmtDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—"

export function ServiceApproval() {
  const [services, setServices] = useState<Service[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [filter, setFilter] = useState<Filter>("pending") // pending first by default
  const [busyId, setBusyId] = useState<string | null>(null)
  const [rejectTarget, setRejectTarget] = useState<Service | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setFailed(false)
    try {
      setServices(await getAdminServices())
    } catch {
      setFailed(true)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
      all: 0,
    }
    for (const s of services ?? []) {
      c.all++
      c[statusOf(s)]++
    }
    return c
  }, [services])

  // In "All", pending services come first
  const visible = useMemo(() => {
    const list = (services ?? []).filter(
      (s) => filter === "all" || statusOf(s) === filter
    )
    return filter === "all"
      ? [...list].sort((a, b) => ORDER[statusOf(a)] - ORDER[statusOf(b)])
      : list
  }, [services, filter])

  async function decide(s: Service, approvalStatus: "approved" | "rejected") {
    setBusyId(s._id)
    try {
      const res = await setServiceApproval(s._id, approvalStatus)
      if (res.ok) {
        setServices(
          (prev) =>
            prev?.map((x) =>
              x._id === s._id ? { ...x, approvalStatus } : x
            ) ?? prev
        )
        toast.success(
          approvalStatus === "approved"
            ? "Service approved"
            : "Service rejected"
        )
        return true
      }
      toast.error(
        res.data.error ?? res.data.message ?? "Couldn't update this service"
      )
      return false
    } catch {
      toast.error("Network error. Try again.")
      return false
    } finally {
      setBusyId(null)
    }
  }

  async function confirmReject() {
    if (!rejectTarget) return
    setSaving(true)
    await decide(rejectTarget, "rejected")
    setSaving(false)
    setRejectTarget(null)
  }

  /* ---------- row pieces ---------- */
  const Actions = ({ s }: { s: Service }) => {
    const status = statusOf(s)
    const busy = busyId === s._id

    const approve = (primary: boolean) => (
      <Button
        size="sm"
        variant={primary ? "default" : "outline"}
        disabled={busy}
        onClick={() => decide(s, "approved")}
        className={
          primary ? "bg-amber-500 text-amber-950 hover:bg-amber-400" : undefined
        }
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Check className="size-4" />
        )}
        Approve
      </Button>
    )
    const reject = (
      <Button
        size="sm"
        variant="outline"
        disabled={busy}
        onClick={() => setRejectTarget(s)}
      >
        <X className="size-4" /> Reject
      </Button>
    )

    return (
      <div className="flex gap-2">
        {status !== "approved" && approve(status === "pending")}
        {status !== "rejected" && reject}
      </div>
    )
  }

  const StatusBadge = ({ s }: { s: Service }) => {
    const st = statusOf(s)
    return (
      <Badge className={`gap-1.5 ${STATUS[st].className}`}>
        <span className="size-1.5 rounded-full bg-current" />
        {STATUS[st].label}
      </Badge>
    )
  }

  const Thumb = ({ s, className }: { s: Service; className: string }) =>
    s.image ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={s.image}
        alt=""
        className={`${className} shrink-0 rounded-lg object-cover`}
      />
    ) : (
      <span className={`${className} shrink-0 rounded-lg bg-amber-100`} />
    )

  /* ---------- body ---------- */
  let content: React.ReactNode

  if (failed) {
    content = (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <p className="text-muted-foreground">
          We couldn&apos;t load the services.
        </p>
        <Button variant="outline" onClick={load}>
          Try again
        </Button>
      </div>
    )
  } else if (!services) {
    content = (
      <div className="space-y-3 p-5">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    )
  } else if (visible.length === 0) {
    content = (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-medium">
          {filter === "pending" ? "All caught up" : "No services here"}
        </p>
        <p className="text-sm text-muted-foreground">
          {filter === "pending"
            ? "No services are waiting for review."
            : "Nothing matches this status right now."}
        </p>
        {filter !== "all" && (
          <Button variant="outline" size="sm" onClick={() => setFilter("all")}>
            View all services
          </Button>
        )}
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
                {["Service", "Technician", "Price", "Submitted", "Status"].map(
                  (h) => (
                    <TableHead
                      key={h}
                      className="h-11 text-xs font-semibold tracking-wider text-amber-900/80 uppercase"
                    >
                      {h}
                    </TableHead>
                  )
                )}
                <TableHead className="h-11 text-right text-xs font-semibold tracking-wider text-amber-900/80 uppercase">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((s) => (
                <TableRow key={s._id} className="hover:bg-amber-50/40">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Thumb s={s} className="size-12" />
                      <div className="min-w-0">
                        <p
                          className="max-w-56 truncate font-medium"
                          title={s.title}
                        >
                          {s.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {s.category}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{s.technicianName ?? "—"}</p>
                    <p
                      className="max-w-56 truncate text-xs text-muted-foreground"
                      title={s.technicianEmail}
                    >
                      {s.technicianEmail}
                    </p>
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">
                    {formatMoney(s.basePrice)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {fmtDate(s.createdAt || s.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge s={s} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Actions s={s} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile / tablet cards */}
        <ul className="divide-y divide-amber-100 lg:hidden">
          {visible.map((s) => (
            <li key={s._id} className="space-y-3 p-4">
              <div className="flex items-start gap-3">
                <Thumb s={s} className="size-14" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium" title={s.title}>
                    {s.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {s.category} · {money(s.basePrice)}
                  </p>
                </div>
                <StatusBadge s={s} />
              </div>
              <p className="text-sm text-muted-foreground">
                {s.technicianName ?? "—"} · {s.serviceMode} · {s.serviceArea}
              </p>
              <div className="flex justify-end">
                <Actions s={s} />
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
          <h2 className="text-lg font-semibold tracking-tight">
            Service approval
          </h2>
          <p className="text-sm text-muted-foreground">
            {services
              ? counts.pending > 0
                ? `${counts.pending} waiting for review · ${counts.all} services in total`
                : `Nothing waiting for review · ${counts.all} services in total`
              : "Loading services…"}
          </p>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by approval status"
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

      {/* Reject confirmation */}
      <Dialog
        open={!!rejectTarget}
        onOpenChange={(o) => !o && !saving && setRejectTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject this service?</DialogTitle>
            <DialogDescription>
              “{rejectTarget?.title}” by{" "}
              {rejectTarget?.technicianName ?? "this technician"} will be hidden
              from customers. You can approve it again later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => setRejectTarget(null)}
            >
              Cancel
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
