"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImagePlus, Loader2, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { createService, uploadToImgBB } from "@/lib/api/services"
import {
  SERVICE_CATEGORIES,
  SERVICE_MODES,
  serviceFormSchema,
  type ServiceFormValues,
} from "@/lib/validations/service"

interface Props {
  /** Logged-in technician. Copied into the service, not editable. */
  technician: { name: string; email: string }
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export function AddServiceForm({ technician }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

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

  const { isSubmitting } = form.formState

  // ---- ImgBB upload -------------------------------------------------------
  async function handleFile(file?: File) {
    if (!file) return
    if (!file.type.startsWith("image/"))
      return toast.error("Choose an image file")
    if (file.size > MAX_IMAGE_SIZE)
      return toast.error("Image must be under 5 MB")

    try {
      setUploading(true)
      const url = await uploadToImgBB(file)
      form.setValue("image", url, { shouldValidate: true, shouldDirty: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // ---- Submit -------------------------------------------------------------
  async function onSubmit(values: ServiceFormValues) {
    try {
      await createService({
        ...values,
        technicianName: technician.name,
        technicianEmail: technician.email,
      })

      toast.success("Service submitted for approval")
      form.reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add a service</CardTitle>
        <CardDescription>
          New services are reviewed by an admin before they appear to customers.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            noValidate
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="iPhone Screen Replacement" {...field} />
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
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner image</FormLabel>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                  {field.value ? (
                    <div className="relative aspect-16/6 w-full overflow-hidden rounded-md border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={field.value}
                        alt="Service banner preview"
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => field.onChange("")}
                        aria-label="Remove banner"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex aspect-16/6 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground transition hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-60"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Uploading banner…
                        </>
                      ) : (
                        <>
                          <ImagePlus className="h-5 w-5" />
                          Upload a banner image (max 5 MB)
                        </>
                      )}
                    </button>
                  )}
                  <FormDescription>Shown on the service card.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
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
                      <Input placeholder="2-3 hours" {...field} />
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
                    >
                      <FormControl>
                        <SelectTrigger>
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
                      <Input placeholder="Dhanmondi, Dhaka" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Technician (read-only, from session) */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Technician name</Label>
                <Input value={technician.name} readOnly disabled />
              </div>
              <div className="space-y-2">
                <Label>Technician email</Label>
                <Input value={technician.email} readOnly disabled />
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
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || uploading}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Adding service…" : "Add service"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
