import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ServiceCardSkeleton() {
  return (
    <Card className="gap-0 overflow-hidden border border-stone-200 py-0">
      <Skeleton className="aspect-4/3 rounded-none bg-amber-100" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex items-center justify-between border-t border-stone-100 p-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-9 w-28" />
      </div>
    </Card>
  )
}
