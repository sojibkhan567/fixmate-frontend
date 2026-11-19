"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"
import { Input } from "../ui/input"
import { ArrowRight } from "lucide-react"
const RegisterForm = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<
      string,
      string
    >
    if (data.password !== data.confirm) {
      toast.error("Passwords don't match. Re-enter both fields.", {
        style: {
          borderRadius: "5px",
          background: "#FDEBE8",
          color: "red",
        },
      })
      setError("Passwords don't match. Re-enter both fields.")
      return
    }
    setError("")
    const { confirm: _c, ...payload } = data
    console.log("register", { ...payload })

    setLoading(true)

    try {
      const { error: authError } = await authClient.signUp.email({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        image: payload.image,
        role: "technician",
      })

      if (authError) {
        toast.error(authError.message || "Registration failed.", {
          style: {
            borderRadius: "5px",
            background: "#FDEBE8",
            color: "red",
          },
        })
        setError(authError.message || "Registration failed.")
        return
      }

      router.push("/")
      router.refresh()
      toast.success("Account has been created successfully.")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="reg-name">Full name</Label>
        <Input
          id="reg-name"
          name="name"
          required
          autoComplete="name"
          placeholder="Alex Rivera"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-email">Email</Label>
        <Input
          id="reg-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-email">Profile Image Url</Label>
        <Input
          id="reg-email"
          name="image"
          type="text"
          autoComplete="url"
          placeholder="https://images.unsplash.com/photo-..."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="reg-password">Password</Label>
          <Input
            id="reg-password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-confirm">Confirm password</Label>
          <Input
            id="reg-confirm"
            name="confirm"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Repeat password"
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-sm border border-red-400 bg-red-100 px-2 py-2 text-sm text-red-600"
        >
          {error}
        </p>
      )}

      {loading ? (
        <Button type="submit" disabled={loading}>
          Creating...
        </Button>
      ) : (
        <Button type="submit">
          Create account
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </form>
  )
}

export default RegisterForm
