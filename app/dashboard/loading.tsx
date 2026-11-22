import { Skeleton } from "@/components/ui/skeleton"

// Shown inside the dashboard (sidebar + header stay visible) while a dashboard page loads
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl" role="status" aria-label="Loading">
      <div className="overflow-hidden rounded-xl border border-amber-200 bg-card shadow-sm">
        <div className="space-y-4 border-b border-amber-100 px-5 py-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>
        <div className="space-y-3 p-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
