/** Branded full-area loader: amber ring spinning around the FixMate wrench */
export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[90vh] flex-col items-center justify-center gap-4"
    >
      <div className="relative flex size-8 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-amber-200 border-t-amber-500" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
