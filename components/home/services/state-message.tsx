import type { ReactNode } from "react"

interface StateMessageProps {
  icon: ReactNode
  title: string
  body: string
  action?: ReactNode
}

export function StateMessage({ icon, title, body, action }: StateMessageProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center rounded-2xl border border-dashed border-amber-300 bg-white px-6 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        {icon}
      </div>
      <h2 className="mt-5 text-xl font-semibold text-stone-900">{title}</h2>
      <p className="mt-2 text-stone-600">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
