import { ChevronDown } from "lucide-react";
import { SectionHeading } from "./section-heading";

const faqs = [
  { q: "When do I pay for a repair?", a: "Only after the technician marks the job as completed. You then pay securely online from your My Bookings page." },
  { q: "Are the technicians verified?", a: "Yes. Every technician is reviewed by our team and every service is approved before it appears on FixMate." },
  { q: "Can I cancel a request?", a: "You can cancel any time while the request is still in the “Requested” status, before a technician accepts it." },
  { q: "How is the final price decided?", a: "Each service shows a starting price. After inspecting the problem, the technician sets the final amount, which you see before paying." },
  { q: "Which devices and appliances can be repaired?", a: "Smartphones, laptops and PCs, ACs, refrigerators, TVs, washing machines and household electrical work, with more categories coming." },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
      <SectionHeading eyebrow="FAQ" title="Questions? We’ve got answers" />
      <div className="space-y-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-xl border border-amber-200 bg-card px-5 open:bg-amber-50/60"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronDown className="size-5 shrink-0 text-amber-600 transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
