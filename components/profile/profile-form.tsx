"use client"

// app/dashboard/profile/profile-form.tsx
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Camera,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { BIO_MAX, profileSchema } from "@/lib/validations/profile-schema"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { getTokenFromClient } from "@/lib/getTokenFromClient"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY
const MAX_FILE_MB = 5

type FormState = { name: string; phone: string; area: string; bio: string }
type FormErrors = Partial<Record<keyof FormState, string>>

async function uploadToImgBB(file: File): Promise<string> {
  if (!IMGBB_KEY) throw new Error("ImgBB API key is missing")
  const fd = new FormData()
  fd.append("image", file)
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: "POST",
    body: fd,
  })
  const json = await res.json()
  if (!res.ok || !json?.success) throw new Error("Image upload failed")
  return json.data.display_url as string
}

export default function ProfileForm() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const { data: session, isPending, refetch } = authClient.useSession()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session?.user as any

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    area: "",
    bio: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Fill the form once the session is loaded
  useEffect(() => {
    if (!user) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      name: user.name ?? "",
      phone: user.phone ?? "",
      area: user.area ?? "",
      bio: user.bio ?? "",
    })
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }))
      // clear this field's error as soon as the user edits it
      setErrors((p) => (p[key] ? { ...p, [key]: undefined } : p))
    }

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith("image/"))
      return toast.error("Please choose an image file")
    if (f.size > MAX_FILE_MB * 1024 * 1024)
      return toast.error(`Image must be under ${MAX_FILE_MB}MB`)
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const resetForm = () => {
    setFile(null)
    setPreview(null)
    setErrors({})
    setForm({
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      area: user?.area ?? "",
      bio: user?.bio ?? "",
    })
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // validate with zod
    const parsed = profileSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      toast.error("Please fix the highlighted fields")
      return
    }
    setErrors({})

    setSaving(true)
    try {
      // 1) upload new photo (if any)
      const image = file ? await uploadToImgBB(file) : undefined

      // 2) call the Express API with the validated + trimmed values
      const token = await getTokenFromClient()

      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...parsed.data,
          ...(image ? { image } : {}),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok)
        throw new Error(
          data?.error ?? data?.message ?? "Failed to update profile"
        )

      // 3) refresh the session so navbar + dashboard top bar update instantly
      await refetch({ query: { disableCookieCache: true } })
      router.refresh()

      setFile(null)
      setPreview(null)
      toast.success("Profile updated successfully")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  if (isPending) return <ProfileSkeleton />

  const avatarSrc = preview ?? user?.image ?? undefined
  const initials = (form.name || user?.name || "U")
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="mx-auto w-full space-y-6 px-4 md:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and profile photo.
        </p>
      </div>

      {/* noValidate: zod handles validation, not the browser */}
      <form onSubmit={onSubmit} noValidate>
        <Card className="overflow-hidden border-amber-200 p-0 shadow-sm dark:border-amber-900/50">
          {/* Banner */}
          <div className="h-32 bg-linear-to-r from-amber-400 via-amber-500 to-orange-500" />

          {/* Avatar + identity */}
          <div className="-mt-14 flex flex-col items-center gap-3 px-6 sm:flex-row sm:items-end">
            <div className="relative">
              <Avatar className="size-28 border-4 border-background shadow-lg ring-2 ring-amber-400">
                <AvatarImage
                  src={avatarSrc}
                  alt={user?.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-amber-100 text-2xl font-semibold text-amber-700">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute right-0 bottom-0 flex size-9 items-center justify-center rounded-full border-2 border-background bg-amber-500 text-white shadow transition hover:bg-amber-600 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                aria-label="Change profile photo"
              >
                <Camera className="size-4" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickFile}
              />
            </div>

            <div className="pb-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
                <Badge className="gap-1 bg-amber-100 text-amber-700 capitalize hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300">
                  <ShieldCheck className="size-3" />
                  {user?.role ?? "user"}
                </Badge>
              </div>
            </div>
          </div>

          <CardHeader className="mt-2">
            <CardTitle>Personal information</CardTitle>
            <CardDescription>
              Update your details below. Email and role can&apos;t be changed.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="name"
                label="Full name"
                icon={UserIcon}
                error={errors.name}
              >
                <Input
                  id="name"
                  value={form.name}
                  onChange={onChange("name")}
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  className="pl-9 focus-visible:border-amber-500 focus-visible:ring-amber-500/30"
                />
              </Field>

              <Field id="phone" label="Phone" icon={Phone} error={errors.phone}>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={onChange("phone")}
                  placeholder="+8801XXXXXXXXX"
                  aria-invalid={!!errors.phone}
                  className="pl-9 focus-visible:border-amber-500 focus-visible:ring-amber-500/30"
                />
              </Field>

              <Field id="area" label="Area" icon={MapPin} error={errors.area}>
                <Input
                  id="area"
                  value={form.area}
                  onChange={onChange("area")}
                  placeholder="e.g. Kushtia Sadar"
                  aria-invalid={!!errors.area}
                  className="pl-9 focus-visible:border-amber-500 focus-visible:ring-amber-500/30"
                />
              </Field>

              <Field id="email" label="Email (read-only)" icon={Mail}>
                <Input
                  id="email"
                  value={user?.email ?? ""}
                  readOnly
                  disabled
                  className="bg-muted pl-9"
                />
              </Field>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role (read-only)</Label>
              <Input
                id="role"
                value={user?.role ?? "user"}
                readOnly
                disabled
                className="bg-muted capitalize"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bio">Bio</Label>
                <span className="text-xs text-muted-foreground">
                  {form.bio.length}/{BIO_MAX}
                </span>
              </div>
              <Textarea
                id="bio"
                rows={4}
                value={form.bio}
                onChange={onChange("bio")}
                placeholder="Tell us a little about yourself..."
                aria-invalid={!!errors.bio}
                className="resize-none focus-visible:border-amber-500 focus-visible:ring-amber-500/30"
              />
              {errors.bio && (
                <p className="text-xs text-destructive">{errors.bio}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col-reverse gap-3 border-t border-amber-100 bg-amber-50/50 py-4 sm:flex-row sm:justify-end dark:border-amber-900/40 dark:bg-amber-950/20">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={resetForm}
              className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-400"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" /> Save changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

function Field({
  id,
  label,
  icon: Icon,
  error,
  children,
}: {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-amber-500" />
        {children}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-6">
      <Skeleton className="h-8 w-48" />
      <Card className="overflow-hidden p-0">
        <Skeleton className="h-32 rounded-none" />
        <div className="space-y-4 p-6">
          <Skeleton className="-mt-14 size-28 rounded-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Card>
    </div>
  )
}
