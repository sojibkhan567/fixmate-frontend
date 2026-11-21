import { CreditCard, Search, Send, Wrench } from "lucide-react";
import { SectionHeading } from "./section-heading";

const steps = [
  { icon: Search, title: "Find a Service", text: "Browse approved repair services and compare prices, modes and technicians." },
  { icon: Send, title: "Send a Request", text: "Share your problem, address and preferred date. It takes about a minute." },
  { icon: Wrench, title: "Technician Fixes It", text: "A verified technician accepts, visits or collects the device, and repairs it." },
  { icon: CreditCard, title: "Pay After Completion", text: "Happy with the work? Pay securely online only once the job is completed." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-amber-50/70 py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How FixMate works"
          title="From broken to fixed in four simple steps"
        />

        <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* connector line (desktop) */}
          <div
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden border-t-2 border-dashed border-amber-300 lg:block"
          />
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex size-16 items-center justify-center rounded-2xl border border-amber-300 bg-background shadow-sm">
                <Icon className="size-7 text-amber-600" />
                <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-amber-950">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
