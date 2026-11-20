// components/services/status-badge.tsx

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ApprovalStatus } from "@/types/services"

const STYLES: Record<ApprovalStatus, string> = {
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  approved:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
}

export function StatusBadge({ status }: { status: ApprovalStatus }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-full border-transparent px-2.5 font-medium capitalize",
        STYLES[status]
      )}
    >
      {status}
    </Badge>
  )
}
