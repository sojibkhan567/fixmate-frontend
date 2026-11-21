"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSearch() {
  const router = useRouter()
  const [q, setQ] = useState("")

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const term = q.trim()
        router.push(
          term ? `/services?search=${encodeURIComponent(term)}` : "/services"
        )
      }}
      className="flex w-full max-w-xl items-center gap-2 rounded-xl border border-amber-300 bg-background p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-amber-400"
    >
      <Search className="ml-2 size-5 shrink-0 text-amber-600" />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search a repair, e.g. “phone screen”"
        aria-label="Search services"
        className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0"
      />
      <Button
        type="submit"
        className="h-10 bg-amber-500 px-5 text-amber-950 hover:bg-amber-400"
      >
        Search
      </Button>
    </form>
  )
}
