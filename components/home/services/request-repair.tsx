"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { bookingSchema } from "@/lib/validations/booking-services"
import { createBooking, hasActiveBooking } from "@/lib/services/api"
import { useAuth } from "@/hooks/use-auth"
import { Service } from "@/types/services"

type Props = {
  service: Service
}

const todayLocal = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

const ctaClass = "h-11 w-full bg-amber-500 text-amber-950 hover:bg-amber-400"

export function RequestRepair({ service }: Props) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [alreadyBooked, setAlreadyBooked] = useState(false)
  const [checking, setChecking] = useState(false)

  // Customers only: check for an existing active booking for this service
  const isCustomer = user?.role === "customer"
  useEffect(() => {
    if (!isCustomer) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecking(true)
    hasActiveBooking(service.id).then((active) => {
      if (!cancelled) {
        setAlreadyBooked(active)
        setChecking(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [isCustomer, service.id])

  if (loading) {
    return (
      <Button className={ctaClass} disabled>
        Booking Services
      </Button>
    )
  }

  // Logged out → sign in, then come back here
  if (!user) {
    return (
      <Button
        className={ctaClass}
        onClick={() =>
          router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`)
        }
      >
        Booking Services
      </Button>
    )
  }

  // Technician / admin → disabled with notice
  if (user.role !== "customer") {
    return (
      <div className="space-y-2">
        <Button className={ctaClass} disabled>
          Booking Services
        </Button>
        <p className="text-sm text-muted-foreground">
          Only customers can request a repair.
        </p>
      </div>
    )
  }

  if (alreadyBooked && !done) {
    return (
      <div className="space-y-2">
        <Button className={ctaClass} disabled>
          Booking Services
        </Button>
        <p className="text-sm text-muted-foreground">
          You already have an active request for this service.{" "}
          <Link
            href="/dashboard/customer/bookings"
            className="font-medium text-amber-700 underline underline-offset-2"
          >
            View My Bookings
          </Link>
        </p>
      </div>
    )
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const input = {
      serviceId: service.id,
      service: {
        title: service.title,
        image: service.image,
        category: service.category,
      },
      basePrice: service.basePrice,
      technician: {
        name: service.technicianName,
        email: service.technicianEmail,
      },
      customer: { name: user?.name, email: user?.email },
      phone: String(fd.get("phone") ?? ""),
      address: String(fd.get("address") ?? ""),
      preferredDate: String(fd.get("preferredDate") ?? ""),
      problemDescription: String(fd.get("problemDescription") ?? ""),
      finalAmount: service.basePrice,
      status: "requested",
      paymentStatus: "unpaid",
    }

    const parsed = bookingSchema.safeParse(input)
    const fieldErrors: Record<string, string> = {}
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] ??= issue.message
      }
    }
    if (input.preferredDate && input.preferredDate < todayLocal()) {
      fieldErrors.preferredDate = "Choose today or a future date"
    }
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length) return

    setPending(true)
    try {
      const res = await createBooking(input)
      const data = res.data

      if (res.status === 409) {
        toast.error("You already have an active request for this service")
        setOpen(false)
        setAlreadyBooked(true)
        return
      }
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't send your request. Try again.")
        return
      }

      setDone(true)
      setAlreadyBooked(true) // button disables once the success dialog is closed
      toast.success("Repair request sent", {
        action: {
          label: "My Bookings",
          onClick: () => router.push("/dashboard/customer/bookings"),
        },
      })
    } catch {
      toast.error("Network error. Check your connection and try again.")
    } finally {
      setPending(false)
    }
  }

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setDone(false)
      setErrors({})
    }
  }

  return (
    <>
      <Button
        className={ctaClass}
        disabled={checking}
        onClick={() => setOpen(true)}
      >
        Booking Services
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="size-12 text-amber-500" />
              <DialogTitle>Request sent</DialogTitle>
              <DialogDescription>
                The technician will review your request for {service.title}.
              </DialogDescription>
              <Button
                nativeButton={false}
                render={<Link href="/dashboard/customer/bookings" />}
                className="mt-2 bg-amber-500 text-amber-950 hover:bg-amber-400"
              >
                Go to My Bookings
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <DialogHeader>
                <DialogTitle>Booking Services</DialogTitle>
                <DialogDescription>{service.title}</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="name" label="Name">
                  <Input
                    id="name"
                    value={user.name}
                    readOnly
                    className="bg-muted"
                  />
                </Field>
                <Field id="email" label="Email">
                  <Input
                    id="email"
                    value={user.email}
                    readOnly
                    className="bg-muted"
                  />
                </Field>
                <Field id="phone" label="Phone" error={errors.phone}>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    aria-invalid={!!errors.phone}
                  />
                </Field>
                <Field
                  id="preferredDate"
                  label="Preferred date"
                  error={errors.preferredDate}
                >
                  <Input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    min={todayLocal()}
                    aria-invalid={!!errors.preferredDate}
                  />
                </Field>
              </div>

              <Field id="address" label="Address" error={errors.address}>
                <Input
                  id="address"
                  name="address"
                  aria-invalid={!!errors.address}
                />
              </Field>

              <Field
                id="problemDescription"
                label="Problem description"
                error={errors.problemDescription}
              >
                <Textarea
                  id="problemDescription"
                  name="problemDescription"
                  rows={4}
                  placeholder="What's wrong, when did it start, and what have you tried?"
                  aria-invalid={!!errors.problemDescription}
                />
              </Field>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={pending}
                  className="bg-amber-500 text-amber-950 hover:bg-amber-400"
                >
                  {pending && <Loader2 className="size-4 animate-spin" />}
                  {pending ? "Sending…" : "Send request"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
