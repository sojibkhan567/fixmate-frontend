import { Star } from "lucide-react";
import { SectionHeading } from "./section-heading";

const reviews = [
  { name: "Sadia Islam", repair: "Smartphone screen", text: "I booked in the evening and the technician arrived next morning. Fixed on the spot, and I paid only after testing the phone.", tone: "bg-amber-200" },
  { name: "Imran Hasan", repair: "Laptop overheating", text: "He cleaned the fans, replaced the thermal paste and explained everything. My laptop is quiet and cool again.", tone: "bg-orange-200" },
  { name: "Farhana Akter", repair: "AC servicing", text: "Professional, punctual and the price matched the listing. Booking and tracking through FixMate was effortless.", tone: "bg-yellow-200" },
];

export function Testimonials() {
  return (
    <section className="bg-amber-50/70 py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Customer stories"
          title="Real repairs, real reviews"
          subtitle="Thousands of devices and appliances are back in action thanks to FixMate technicians."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="flex h-full flex-col rounded-xl border border-amber-200 bg-background p-6 shadow-sm"
            >
              <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 leading-relaxed">“{r.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className={`flex size-10 items-center justify-center rounded-full font-semibold text-amber-950 ${r.tone}`}>
                  {r.name[0]}
                </span>
                <span className="text-sm leading-tight">
                  <span className="block font-medium">{r.name}</span>
                  <span className="text-muted-foreground">{r.repair}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
