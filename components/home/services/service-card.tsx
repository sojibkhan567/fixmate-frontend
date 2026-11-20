import Link from "next/link"
import { MapPin, User, Wrench } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Service } from "@/types/services"
import { usd } from "@/components/services/my-services-table"

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="group flex flex-col gap-0 overflow-hidden border border-stone-200 bg-white py-0 transition-shadow hover:shadow-lg hover:shadow-amber-900/10">
      <div className="relative aspect-4/3 overflow-hidden bg-amber-100">
        {service.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.image}
            alt={service.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-amber-400">
            <Wrench className="size-12" />
          </div>
        )}
        <Badge className="absolute top-3 left-3 gap-1 border-0 bg-white/95 text-stone-800 shadow-sm">
          {service.category}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="mt-0.5 line-clamp-2 text-lg leading-snug font-semibold text-stone-900">
            {service.title}
          </h3>
        </div>

        <ul className="space-y-1.5 text-sm text-stone-600">
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-stone-400" />
            <span className="line-clamp-1">{service.serviceArea}</span>
          </li>
          <li className="flex items-center gap-2">
            <User className="size-4 shrink-0 text-stone-400" />
            <span className="line-clamp-1">
              {service.technicianName ?? "Technician"}
            </span>
          </li>
        </ul>
      </CardContent>

      <CardFooter className="items-end justify-between gap-3 border-t border-stone-100 bg-amber-50/50 p-4">
        <div>
          <p className="text-xs text-stone-500">Starting from</p>
          <p className="text-xl font-bold text-stone-900">
            {usd.format(service.basePrice)}
          </p>
        </div>
        {/* Base UI: use `render` instead of Radix's `asChild` */}
        <Button
          nativeButton={false}
          render={<Link href={`/services/${service._id}`} />}
          className="bg-amber-500 font-semibold text-stone-900 hover:bg-amber-400 focus-visible:ring-amber-500/40"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
