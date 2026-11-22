import { RegisterForm } from "@/components/auth/register-form"

export const metadata = { title: "Create account | FixMate" }

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-amber-50 to-background px-4 py-12">
      <RegisterForm />
    </main>
  )
}
