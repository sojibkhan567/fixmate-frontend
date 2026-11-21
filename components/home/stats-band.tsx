const stats = [
  { value: "4.8/5", label: "Average customer rating" },
  { value: "30+", label: "Cities covered" },
  { value: "< 2 hrs", label: "Average response time" },
  { value: "98%", label: "Fixed on the first visit" },
]

export function StatsBand() {
  return (
    <section
      aria-label="FixMate in numbers"
      className="bg-stone-950 text-amber-50"
    >
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`text-center ${i > 0 ? "lg:border-l lg:border-stone-800" : ""}`}
          >
            <dd className="text-3xl font-semibold text-amber-400 sm:text-4xl">
              {s.value}
            </dd>
            <dt className="mt-1 text-sm text-stone-400">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
