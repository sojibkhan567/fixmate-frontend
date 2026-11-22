"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { loginSchema, type LoginValues } from "@/lib/validations/login-schema"

const ROLES = ["customer", "technician", "admin"]

/** Only same-site relative paths (blocks open redirects like //evil.com) */
const isSafePath = (url: string | null): url is string =>
  !!url && url.startsWith("/") && !url.startsWith("//")

/**
 * Where to go after login:
 *  - the page the user came from (e.g. a service they wanted to request), unless it is
 *    a dashboard area that belongs to a different role
 *  - otherwise their own role dashboard: /dashboard/customer | technician | admin
 */
function getRedirect(callbackUrl: string | null, role: unknown) {
  const home = ROLES.includes(role as string)
    ? `/dashboard/${role}`
    : "/dashboard"
  if (!isSafePath(callbackUrl)) return home
  if (callbackUrl.startsWith("/dashboard") && !callbackUrl.startsWith(home))
    return home
  return callbackUrl
}

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", rememberMe: true },
  })

  async function onSubmit(values: LoginValues) {
    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
    })

    if (error) {
      toast.error(error.message ?? "Invalid email or password")
      return
    }

    toast.success("Welcome back!")
    const role = (data?.user as { role?: string } | undefined)?.role
    router.push(getRedirect(params.get("callbackUrl"), role))
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-md space-y-5 rounded-2xl border border-amber-200 bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to manage your repair requests.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
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
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-4 rounded border-amber-300 accent-amber-500"
          {...register("rememberMe")}
        />
        Remember me
      </label>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full bg-amber-500 text-amber-950 hover:bg-amber-400"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to FixMate?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-amber-700 underline underline-offset-2"
        >
          Create an account
        </Link>
      </p>
    </form>
  )
}
