"use client"

// components/dashboard/stats-overview.tsx
import { useCallback, useEffect, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Clock,
  HardHat,
  Hourglass,
  Layers,
  RefreshCw,
  Users,
  Wrench,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getTokenFromClient } from "@/lib/getTokenFromClient"

const API_URL = process.env.NEXT_PUBLIC_API_URL

type Role = "customer" | "technician" | "admin"

type StatConfig = {
  key: string
  label: string
  hint: string
  icon: LucideIcon
}

const CONFIG: Record<
  Role,
  { title: string; subtitle: string; icon: LucideIcon; stats: StatConfig[] }
> = {
  customer: {
    title: "Customer Dashboard",
    subtitle: "Track your service requests and jobs at a glance.",
    icon: ClipboardList,
    stats: [
      {
        key: "totalRequests",
        label: "Total Requests",
        hint: "All bookings you've made",
        icon: ClipboardList,
      },
      {
        key: "activeJobs",
        label: "Active Jobs",
        hint: "Currently in progress",
        icon: Wrench,
      },
      {
        key: "completedJobs",
        label: "Completed Jobs",
        hint: "Successfully finished",
        icon: CheckCircle2,
      },
    ],
  },
  technician: {
    title: "Technician Dashboard",
    subtitle: "Manage your services and incoming requests.",
    icon: HardHat,
    stats: [
      {
        key: "totalServices",
        label: "Total Services",
        hint: "Services you've created",
        icon: Layers,
      },
      {
        key: "approvedServices",
        label: "Approved Services",
        hint: "Live and bookable",
        icon: BadgeCheck,
      },
      {
        key: "pendingRequests",
        label: "Pending Requests",
        hint: "Waiting for your response",
        icon: Clock,
      },
    ],
  },
  admin: {
    title: "Admin Dashboard",
    subtitle: "Platform overview across users and services.",
    icon: Users,
    stats: [
      {
        key: "totalUsers",
        label: "Total Users",
        hint: "All registered accounts",
        icon: Users,
      },
      {
        key: "totalTechnicians",
        label: "Total Technicians",
        hint: "Users with technician role",
        icon: HardHat,
      },
      {
        key: "pendingServices",
        label: "Pending Services",
        hint: "Awaiting approval",
        icon: Hourglass,
      },
    ],
  },
}

export default function StatsOverview({ role }: { role: Role }) {
  const { title, subtitle, icon: HeaderIcon, stats } = CONFIG[role]
  const { data: session } = authClient.useSession()

  const [data, setData] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const token = await getTokenFromClient()
    try {
      const res = await fetch(`${API_URL}/dashboard/${role}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error ?? "Failed to load stats")
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [role])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 p-5 shadow-sm md:p-6 dark:border-amber-900/40 dark:from-amber-950/30 dark:via-amber-900/20 dark:to-amber-950/30">
        <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-amber-200/40 blur-2xl" />
        <HeaderIcon className="pointer-events-none absolute -right-3 -bottom-5 size-28 text-amber-300/30" />
        <div className="relative flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-white shadow-sm md:size-14">
            <HeaderIcon className="size-6 md:size-7" />
          </div>
          <div>
            <p className="text-xs font-medium text-amber-600 md:text-sm dark:text-amber-300">
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}{" "}
              👋
            </p>
            <h1 className="text-xl font-bold tracking-tight text-amber-950 md:text-2xl dark:text-amber-50">
              {title}
            </h1>
            <p className="mt-0.5 max-w-xl text-sm text-amber-800/70 dark:text-amber-100/70">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={load}
              className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
            >
              <RefreshCw className="mr-2 size-4" /> Try again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ key, label, hint, icon: Icon }) => (
          <Card
            key={key}
            className="group relative overflow-hidden border-amber-100 py-0 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md dark:border-amber-900/40"
          >
            <div className="h-0.5 bg-gradient-to-r from-amber-300 to-amber-400" />
            <CardContent className="flex items-start justify-between gap-4 p-5">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {label}
                </p>
                {loading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <p className="text-3xl font-bold tracking-tight text-amber-500 dark:text-amber-400">
                    {(data?.[key] ?? 0).toLocaleString()}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{hint}</p>
              </div>
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500 transition group-hover:bg-amber-400 group-hover:text-white dark:bg-amber-900/30 dark:text-amber-300">
                <Icon className="size-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
