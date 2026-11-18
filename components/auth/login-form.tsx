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

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = Object.fromEntries(new FormData(e.currentTarget)) as Record<
      string,
      string
    >
    //console.log("login", { ...data, remember })
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

      if (data) {
        if (data.user.role) {
          router.replace(`dashboard/${data.user.role}`)
        }
      } else {
        router.replace("/sign-in")
      }
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
