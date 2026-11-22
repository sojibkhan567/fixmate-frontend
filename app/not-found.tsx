import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = { title: "Page not found | FixMate" }

// Shown for any URL that doesn't exist (and whenever a page calls notFound())
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-amber-50 to-background px-4 text-center">
      <div className="relative">
        <p className="text-8xl font-bold tracking-tight text-amber-200 select-none sm:text-9xl">
          404
        </p>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Page not found
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back to fixing things.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button
          nativeButton={false}
          render={<Link href="/" />}
          size="lg"
          className="bg-amber-500 text-amber-950 hover:bg-amber-400"
        >
          <ArrowLeft className="size-4" /> Back to home
        </Button>
        <Button
          nativeButton={false}
          render={<Link href="/services" />}
          size="lg"
          variant="outline"
          className="border-amber-300 hover:bg-amber-50"
        >
          Browse services
        </Button>
      </div>
    </main>
  )
}
