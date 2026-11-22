import Link from "next/link"
import { UserRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatMoney } from "@/lib/utils"
import { Service } from "@/types/services"
import { categoryIcon } from "@/lib/demo-data"

export function ServiceCard({ service }: { service: Service }) {
  const Icon = categoryIcon(service.category)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-amber-200 bg-card transition-shadow hover:shadow-lg hover:shadow-amber-100">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200">
        {service.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.image}
            alt={service.title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Icon className="size-14 text-amber-500/70" strokeWidth={1.5} />
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-background/90 text-amber-900 hover:bg-background/90">
          {service.category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 min-h-[3rem] text-lg leading-snug font-semibold">
          {service.title}
        </h3>

        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span className="flex min-w-0 items-center gap-1.5">
            <UserRound className="size-4 shrink-0 text-amber-600" />
            <span className="truncate">
              {service.technicianName ?? "FixMate technician"}
            </span>
          </span>
          <Badge
            variant="outline"
            className="shrink-0 border-amber-300 text-amber-900"
          >
            {service.serviceMode}
          </Badge>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-amber-100 pt-4">
          <div className="leading-tight">
            <p className="text-xs text-muted-foreground">Starting price</p>
            <p className="text-xl font-semibold text-amber-700">
              {formatMoney(service.basePrice)}
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href={`/services/${service._id}`} />}
            className="bg-amber-500 text-amber-950 hover:bg-amber-400"
          >
            View Details
          </Button>
        </div>
      </div>
    </article>
  )
}
