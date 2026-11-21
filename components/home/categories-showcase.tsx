"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, LayoutGrid, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/demo-data";
import { SectionHeading } from "./section-heading";

const stats = [
  { value: "500+", label: "Verified technicians" },
  { value: "12k+", label: "Jobs completed" },
  { value: "100%", label: "Pay after service" },
];

const trust = [
  "Every technician is ID and skill verified",
  "Pay only after the repair is completed",
  "Clear starting prices, no hidden charges",
];

export function CategoriesShowcase() {
  const [active, setActive] = useState(CATEGORIES[0].name);
  const selected = CATEGORIES.find((c) => c.name === active) ?? CATEGORIES[0];
  const SelectedIcon = selected.icon;

  return (
    <section id="categories" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <SectionHeading
        eyebrow="Popular categories"
        title="Whatever broke, we have a specialist"
        subtitle="Pick a category to see common repairs, then browse matching services."
      />

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Categories + selected panel */}
        <div className="space-y-5 lg:col-span-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map(({ name, icon: Icon }) => {
              const isActive = name === active;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(name)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isActive
                      ? "border-amber-500 bg-amber-100 text-amber-950 shadow-sm"
                      : "border-amber-200 bg-card hover:border-amber-400 hover:bg-amber-50"
                  }`}
                >
                  <Icon className={`size-6 ${isActive ? "text-amber-700" : "text-amber-600"}`} />
                  {name}
                </button>
              );
            })}
            <Link
              href="/services"
              className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-amber-300 p-4 text-center text-sm font-medium text-amber-900 transition-colors hover:bg-amber-50"
            >
              <LayoutGrid className="size-6 text-amber-600" />
              All services
            </Link>
          </div>

          <div
            key={selected.name}
            className="rounded-xl border border-amber-200 bg-amber-50/60 p-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-amber-950">
                <SelectedIcon className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selected.name} repair</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{selected.blurb}</p>
              </div>
            </div>

            <ul className="mt-5 flex flex-wrap gap-2">
              {selected.repairs.map((r) => (
                <li key={r} className="rounded-full border border-amber-300 bg-background px-3 py-1 text-xs font-medium">
                  {r}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Starting from{" "}
                <span className="text-lg font-semibold text-amber-700">
                  ৳{selected.from.toLocaleString()}
                </span>
              </p>
              <Button
                nativeButton={false}
                render={<Link href={`/services?category=${encodeURIComponent(selected.name)}`} />}
                className="bg-amber-500 text-amber-950 hover:bg-amber-400"
              >
                View {selected.name} services <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Why choose us */}
        <aside className="space-y-5 rounded-xl border border-amber-200 p-6 lg:col-span-2">
          <h3 className="text-xl font-semibold">Why choose FixMate</h3>

          <div className="grid grid-cols-3 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="rounded-lg bg-amber-100 px-2 py-3 text-center">
                <p className="text-xl font-bold text-amber-900">{s.value}</p>
                <p className="mt-0.5 text-[11px] leading-tight text-amber-900/80">{s.label}</p>
              </div>
            ))}
          </div>

          <ul className="space-y-3">
            {trust.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-600" />
                {t}
              </li>
            ))}
          </ul>

          <figure
            key={selected.name}
            className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 animate-in fade-in-0 duration-300"
          >
            <div className="flex items-center justify-between">
              <Quote className="size-5 text-amber-500" />
              <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <blockquote className="mt-2 text-sm leading-relaxed">{selected.quote.text}</blockquote>
            <figcaption className="mt-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{selected.quote.name}</span> ·{" "}
              {selected.quote.place}
            </figcaption>
          </figure>
        </aside>
      </div>
    </section>
  );
}
