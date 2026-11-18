import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonAvatar() {
  return (
    <div className="flex w-fit items-center gap-4">
      <Skeleton className="size-10 shrink-0 rounded-full" />
    </div>
  )
}
