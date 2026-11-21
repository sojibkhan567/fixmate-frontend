"use client"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { toast } from "react-toastify"
const LoginForm = () => {
  const [loading, setLoading] = useState(false)

  const DASHBOARD_BY_ROLE: Record<string, string> = {
    customer: "/dashboard/customer",
    technician: "/dashboard/technician",
    admin: "/dashboard/admin",
  }

  /** Only allow internal paths like "/services/123". Blocks "https://evil.com" and "//evil.com" */
  function getSafeCallbackUrl(url: string | null): string | null {
    if (!url) return null
    if (!url.startsWith("/") || url.startsWith("//") || url.startsWith("/\\"))
      return null
    return url
  }

  // inside your component
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"))

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = Object.fromEntries(new FormData(e.currentTarget)) as Record<
      string,
      string
    >
    setLoading(true)

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email: user.email,
        password: user.password,
      })

      if (authError) {
        toast.error(authError.message || "Sign in failed.", {
          style: {
            borderRadius: "5px",
            background: "#FDEBE8",
            color: "red",
          },
        })
        return
      }

      if (!data) {
        router.replace("/sign-in")
        return
      }

      const role = data.user.role as string | undefined
      const dashboard =
        (role && DASHBOARD_BY_ROLE[role]) || "/dashboard/customer"

      router.replace(callbackUrl ?? dashboard)
      router.refresh()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
          <Input
            id="fieldgroup-email"
            type="email"
            name="email"
            placeholder="Enter your email"
          />
          <FieldDescription>
            We&apos;ll send updates to this address.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="fieldgroup-password">Password</FieldLabel>
          <Input
            id="fieldgroup-password"
            type="password"
            name="password"
            placeholder="Enter your password"
          />
          <FieldDescription>
            We&apos;ll send updates to this address.
          </FieldDescription>
        </Field>
        <Field orientation="horizontal">
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Submit
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default LoginForm
