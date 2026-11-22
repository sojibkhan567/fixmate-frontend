import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"

export const metadata = { title: "Sign in | FixMate" }

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-amber-50 to-background px-4 py-12">
      {/* Suspense is required because the form reads ?callbackUrl= */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  )
}
