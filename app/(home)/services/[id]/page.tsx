import { notFound } from "next/navigation"
import { Clock, MapPin, Wrench, Tag } from "lucide-react"
import { getService } from "@/lib/services/api"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RequestRepair } from "@/components/home/services/request-repair"
import { Separator } from "@/components/ui/separator"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const service = await getService(id)
  return { title: service ? service.title : "Service not found" }
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { id } = await params
  const service = await getService(id)
  console.log(service)
  if (!service) notFound()

  const technician = service.technicianName

  const facts = [
    {
      icon: Tag,
      label: "Starting price",
      value: `$ ${Number(service.basePrice).toLocaleString()}`,
    },
    {
      icon: Clock,
      label: "Estimated duration",
      value: service.estimatedDuration,
    },
    { icon: Wrench, label: "Service mode", value: service.serviceMode },
    { icon: MapPin, label: "Service area", value: service.serviceArea },
  ]

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
        <div className="lg:col-span-3">
          <div className="aspect-16/10 overflow-hidden rounded-xl bg-amber-50 ring-1 ring-amber-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={service.image}
              alt={service.title}
              className="size-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-2">
          <Badge className="w-fit bg-amber-100 text-amber-900 hover:bg-amber-100">
            {service.category}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {service.title}
          </h1>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-5 border-y border-amber-200 py-5">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2.5">
                <Icon className="mt-0.5 size-4 shrink-0 text-amber-600" />
                <div>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="font-medium capitalize">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <RequestRepair service={{ id: service._id, title: service.title }} />
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-5 lg:gap-12">
        <section className="lg:col-span-3">
          <h2 className="mb-3 text-xl font-semibold">Description</h2>
          <Separator className="mb-3 bg-amber-200" />
          <p className="max-w-prose leading-relaxed whitespace-pre-line text-muted-foreground">
            {service.description}
          </p>
        </section>

        {technician && (
          <aside className="lg:col-span-2">
            <h2 className="mb-3 text-xl font-semibold">Your technician</h2>
            <div className="flex gap-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
              <Avatar className="size-14">
                <AvatarFallback className="bg-amber-200 text-amber-900">
                  {technician.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium">{technician}</p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </main>
  )
}
