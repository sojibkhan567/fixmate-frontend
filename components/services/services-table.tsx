"use client"

import { useOptimistic, useState, useTransition } from "react"
import { CircleCheck, CircleX } from "lucide-react"

import { StatusBadge } from "@/components/services/status-badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  formatDate,
  sortPendingFirst,
  type Service,
  type StatusFilter,
} from "@/types/services"
import { updateServiceStatus } from "@/lib/services/action"
import { toast } from "react-toastify"
import { usd } from "./my-services-table"

type Decision = "approved" | "rejected"

type Props = {
  services: Service[]
  statusFilter: StatusFilter
  hasFilters: boolean
}

export function ServicesTable({ services, statusFilter, hasFilters }: Props) {
  const [busyId, setBusyId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const [optimistic, applyOptimistic] = useOptimistic(
    services,
    (state, { id, status }: { id: string; status: Decision }) =>
      state
        .map((s) => (s._id === id ? { ...s, approvalStatus: status } : s))
        // Row no longer matches the active status filter, so hide it
        .filter(
          (s) => statusFilter === "all" || s.approvalStatus === statusFilter
        )
  )

  const rows =
    statusFilter === "all" ? sortPendingFirst(optimistic) : optimistic

  function decide(service: Service, status: Decision) {
    setBusyId(service._id)
    startTransition(async () => {
      applyOptimistic({ id: service._id, status })
      const result = await updateServiceStatus(service._id, status)
      setBusyId(null)
      if (result.ok) {
        toast.success(
          status === "approved"
            ? `Approved “${service.title}”`
            : `Rejected “${service.title}”`
        )
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="font-semibold text-foreground">
            Service Image
          </TableHead>
          <TableHead className="font-semibold text-foreground">
            Service Name
          </TableHead>
          <TableHead className="font-semibold text-foreground">
            Technician
          </TableHead>
          <TableHead className="font-semibold text-foreground">
            Submitted
          </TableHead>
          <TableHead className="font-semibold text-foreground">Price</TableHead>
          <TableHead className="font-semibold text-foreground">
            Status
          </TableHead>
          <TableHead className="text-right font-semibold text-foreground">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={7}
              className="h-40 text-center text-sm text-muted-foreground"
            >
              {hasFilters
                ? "No services match your filters."
                : statusFilter === "pending"
                  ? "All caught up. No pending services."
                  : "No services found."}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((s) => {
            const working = busyId === s._id
            return (
              <TableRow key={s._id} className="h-13.25">
                <TableCell>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-12 w-20 rounded object-cover"
                  />
                </TableCell>
                <TableCell>
                  <div className="leading-tight font-medium">{s.title}</div>
                  {s.category && (
                    <div className="text-xs text-muted-foreground">
                      {s.category}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="leading-tight">
                    {s.technicianName ?? "Unknown"}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {formatDate(s.updatedAt || s.createdAt)}
                </TableCell>
                <TableCell className="text-sm">
                  {usd.format(s.basePrice)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={s.approvalStatus} />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-500/10"
                            disabled={
                              working || s.approvalStatus === "approved"
                            }
                            onClick={() => decide(s, "approved")}
                            aria-label={`Approve ${s.title}`}
                          >
                            <CircleCheck className="size-4" />
                          </Button>
                        }
                      ></TooltipTrigger>
                      <TooltipContent>Approve</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                            disabled={
                              working || s.approvalStatus === "rejected"
                            }
                            onClick={() => decide(s, "rejected")}
                            aria-label={`Reject ${s.title}`}
                          >
                            <CircleX className="size-4" />
                          </Button>
                        }
                      ></TooltipTrigger>
                      <TooltipContent>Reject</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
