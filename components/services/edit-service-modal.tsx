"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImagePlus, Loader2, X } from "lucide-react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { uploadToImgBB } from "@/lib/api/services"
import {
  SERVICE_MODES,
  serviceFormSchema,
  type ServiceFormValues,
} from "@/lib/validations/service"
import { CATEGORY_ITEMS } from "@/lib/services"

export type Service = ServiceFormValues & {
  _id: string
  approvalStatus: "pending" | "approved" | "rejected"
  technicianName?: string
  technicianEmail?: string
}

type Props = {
  service: Service | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: (service: Service) => void
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const statusStyles: Record<Service["approvalStatus"], string> = {
  pending: "bg-amber-100 text-amber-700 ring-amber-200",
  approved: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  rejected: "bg-red-100 text-red-700 ring-red-200",
}

function toFormValues(service: Service): ServiceFormValues {
  return {
    title: service.title,
    description: service.description ?? "",
    category: service.category,
    image: service.image,
    basePrice: service.basePrice,
    estimatedDuration: service.estimatedDuration ?? "",
    serviceMode: service.serviceMode,
    serviceArea: service.serviceArea ?? "",
    isAvailable: service.isAvailable ?? true,
  }
}

export default function EditServiceModal({
  service,
  open,
  onOpenChange,
  onUpdated,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [localPreview, setLocalPreview] = useState("") // shown while uploading

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      estimatedDuration: "",
      serviceArea: "",
      isAvailable: true,
    },
  })

  const { isSubmitting, isDirty, dirtyFields } = form.formState
  const busy = isSubmitting || uploading

  // Fill the form every time the modal opens
  useEffect(() => {
    if (!service || !open) return
    form.reset(toFormValues(service))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalPreview("")
    if (fileInputRef.current) fileInputRef.current.value = ""
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service?._id, open])

  // ---- ImgBB upload -------------------------------------------------------
  async function handleFile(file?: File) {
    if (!file) return
    if (!file.type.startsWith("image/"))
      return toast.error("Choose an image file")
    if (file.size > MAX_IMAGE_SIZE)
      return toast.error("Image must be under 5 MB")

    // Show the picked image immediately
    const objectUrl = URL.createObjectURL(file)
    setLocalPreview(objectUrl)

    try {
      setUploading(true)
      const url = await uploadToImgBB(file)
      // Preload the uploaded image so the preview doesn't flicker
      await new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => resolve()
        img.src = url
      })

      form.setValue("image", url, { shouldValidate: true, shouldDirty: true })
      toast.success("Image uploaded successfully")
      setLocalPreview(url)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      //URL.revokeObjectURL(objectUrl)
      //setLocalPreview(url) // now the preview uses the uploaded URL
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // ---- Submit -------------------------------------------------------------
  async function onSubmit(values: ServiceFormValues) {
    if (!service) return

    // Send only the fields the user actually changed
    const payload: Record<string, unknown> = {}
    ;(Object.keys(dirtyFields) as (keyof ServiceFormValues)[]).forEach(
      (key) => {
        payload[key] = values[key]
      }
    )

    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save")
      return
    }

    console.log(values)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services/${service._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          // credentials: "include", // uncomment if your API uses cookie auth
          body: JSON.stringify(payload),
        }
      )

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update service")
      }

      onUpdated(data.data)
      toast.success(data?.message || "Service updated successfully")
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      if (busy) return
      if (
        isDirty &&
        !window.confirm("You have unsaved changes. Close without saving?")
      ) {
        return
      }
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
        {/* Header */}
        <DialogHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div>
              <DialogTitle className="text-lg font-semibold">
                Edit service
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                Changes to an approved service may need admin review again.
              </DialogDescription>
            </div>

            {service && (
              <span
                className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${
                  statusStyles[service.approvalStatus]
                }`}
              >
                {service.approvalStatus}
              </span>
            )}
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
            noValidate
          >
            <div className="space-y-6 px-6 py-5">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="iPhone Screen Replacement"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? null}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORY_ITEMS.map((c, i) => (
                          <SelectItem key={i} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="What does this service include?"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Banner image */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => {
                  const previewSrc = localPreview || field.value

                  return (
                    <FormItem>
                      <FormLabel>Banner image</FormLabel>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files?.[0])}
                      />

                      {previewSrc ? (
                        <div className="relative aspect-16/6 w-full overflow-hidden rounded-md border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewSrc}
                            alt="Service banner preview"
                            className="h-full w-full object-cover"
                          />

                          {uploading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-sm text-white">
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Uploading banner…
                            </div>
                          )}

                          <div className="absolute top-2 right-2 flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              className="h-7 px-2 text-xs"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={busy}
                            >
                              Replace
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="secondary"
                              className="h-7 w-7"
                              onClick={() =>
                                form.setValue("image", "", {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                })
                              }
                              disabled={busy}
                              aria-label="Remove banner"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => fileInputRef.current?.click()}
                          className="flex aspect-16/6 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground transition hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-60"
                        >
                          <ImagePlus className="h-5 w-5" />
                          Upload a banner image (max 5 MB)
                        </button>
                      )}

                      <FormDescription>
                        Shown on the service card.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <Separator />

              {/* Price, duration, mode, area */}
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting price (USD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="0.01"
                          placeholder="25"
                          disabled={isSubmitting}
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated duration</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="2-3 hours"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service mode</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? null}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SERVICE_MODES.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service area</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Dhanmondi, Dhaka"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Technician (read-only, from the saved service) */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Technician name</Label>
                  <Input
                    value={service?.technicianName ?? ""}
                    readOnly
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Technician email</Label>
                  <Input
                    value={service?.technicianEmail ?? ""}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              {/* Availability */}
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Available for booking</FormLabel>
                      <FormDescription>
                        Turn off to hide this service from customers.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t bg-background px-6 py-4">
              <p className="text-xs text-muted-foreground">
                {isDirty ? "You have unsaved changes" : "No changes yet"}
              </p>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleClose(false)}
                  disabled={busy}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={busy || !isDirty}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {uploading
                    ? "Uploading…"
                    : isSubmitting
                      ? "Updating…"
                      : "Update service"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
