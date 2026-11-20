"use client"

import { useState } from "react"
import Link from "next/link"
import { PackageOpen, Pencil, Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "react-toastify"
import { getTokenFromClient } from "@/lib/getTokenFromClient"

type ApprovalStatus = "pending" | "approved" | "rejected"

type Service = {
  _id: string
  title: string
  category: string
  image: string
  basePrice: number
  approvalStatus: ApprovalStatus
  isAvailable: boolean
}

const STATUS_STYLES: Record<
  ApprovalStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    className:
      "border-green-600/30 bg-green-600/10 text-green-700 dark:text-green-400",
  },
  rejected: {
    label: "Rejected",
    className: "border-red-600/30 bg-red-600/10 text-red-700 dark:text-red-400",
  },
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export function MyServicesTable({
  services: initialServices,
}: {
  services: Service[]
}) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [deleting, setDeleting] = useState<Service | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function toggleAvailability(id: string, next: boolean) {
    try {
      const token = await getTokenFromClient()

      setUpdatingId(id)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services/${id}/availability`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isAvailable: next,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to update availability")
      }

      // Update UI only after API successfully updates MongoDB
      setServices((prev) =>
        prev.map((service) =>
          service._id === id
            ? {
                ...service,
                isAvailable: next,
              }
            : service
        )
      )

      toast.success(
        next ? "Service is now available" : "Service is now unavailable"
      )
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update availability"
      )
    } finally {
      setUpdatingId(null)
    }
  }

  async function confirmDelete() {
    if (!deleting) return

    try {
      const token = await getTokenFromClient()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services/${deleting._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete service")
      }

      // Remove deleted service from table
      setServices((prev) =>
        prev.filter((service) => service._id !== deleting._id)
      )

      toast.success(data.message || "Service deleted successfully")

      setDeleting(null)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service"
      )
    }
  }

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-dashed py-16 text-center">
        <PackageOpen className="h-8 w-8 text-muted-foreground" />
        <p className="font-medium">You haven’t added any services yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Add your first service and it will show up here once an admin approves
          it.
        </p>
        <Link
          href="/dashboard/technician/add-service"
          className={buttonVariants()}
        >
          Add service
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {services.map((service) => {
              const status = STATUS_STYLES[service.approvalStatus]

              return (
                <TableRow key={service._id}>
                  <TableCell>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-12 w-20 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell className="max-w-56 truncate font-medium">
                    {service.title}
                  </TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{usd.format(service.basePrice)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={status.className}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={service.isAvailable}
                      disabled={updatingId === service._id}
                      onCheckedChange={(next) =>
                        toggleAvailability(service._id, next)
                      }
                      aria-label={`Toggle availability for ${service.title}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => toast.info("Edit modal opens here")}
                        aria-label={`Edit ${service.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleting(service)}
                        aria-label={`Delete ${service.title}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleting?.title}” will be permanently removed. This can’t be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
