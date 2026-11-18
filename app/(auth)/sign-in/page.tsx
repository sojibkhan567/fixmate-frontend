import LoginForm from "@/components/auth/login-form"
import { Card } from "@/components/ui/card"

const SignInPage = () => {
  return (
    <div className="flex flex-1 items-center justify-center p-4 py-10">
      <div className="w-full max-w-sm">
        <Card className="px-8 py-10 shadow-md">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to your dashboard account
            </p>
          </div>
          <LoginForm />
        </Card>
      </div>
    </div>
  )
}

export default SignInPage
