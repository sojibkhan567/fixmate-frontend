import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import React from "react"
import { Button } from "@/components/ui/button"

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
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                <Input
                  id="fieldgroup-email"
                  type="email"
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
        </Card>
      </div>
    </div>
  )
}

export default SignInPage
