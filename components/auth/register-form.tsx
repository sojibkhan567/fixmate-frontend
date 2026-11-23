"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import {
  registerSchema,
  type RegisterValues,
} from "@/lib/validations/register-schema"

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      area: "",
      bio: "",
      password: "",
      confirmPassword: "",
    },
  })

  const bioLength = (watch("bio") ?? "").length

  async function onSubmit(values: RegisterValues) {
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      area: values.area,
      bio: values.bio ?? "", // optional: empty string when left blank
      role: "customer",
    })

    if (error) {
      toast.error(error.message ?? "Couldn't create your account. Try again.")
      return
    }

    toast.success("Account created. Welcome to FixMate!")
    router.push("/")
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-md space-y-5 rounded-2xl border border-amber-200 bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign up to request repairs from verified technicians.
        </p>
      </div>

      <Field id="name" label="Full name" error={errors.name?.message}>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Your full name"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </Field>

      <Field id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="phone" label="Phone" error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="01XXXXXXXXX"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </Field>
        <Field id="area" label="City / area" error={errors.area?.message}>
          <Input
            id="area"
            autoComplete="address-level2"
            placeholder="Mirpur, Dhaka"
            aria-invalid={!!errors.area}
            {...register("area")}
          />
        </Field>
      </div>

      <Field id="bio" label="Short bio (optional)" error={errors.bio?.message}>
        <Textarea
          id="bio"
          rows={3}
          placeholder="A line about you, e.g. your skills and experience"
          aria-invalid={!!errors.bio}
          {...register("bio")}
        />
        <p className="text-right text-xs text-muted-foreground">
          {bioLength}/300
        </p>
      </Field>

      <Field
        id="password"
        label="Password"
        error={errors.password?.message}
        hint="At least 8 characters with a letter and a number."
      >
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            className="pr-10"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </Field>

      <Field
        id="confirmPassword"
        label="Confirm password"
        error={errors.confirmPassword?.message}
      >
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
      </Field>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full bg-amber-500 text-amber-950 hover:bg-amber-400"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-amber-700 underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}
