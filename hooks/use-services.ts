import { Service } from "@/types/services"
import { useEffect, useState } from "react"

export function useServices(queryString: string) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/services?${queryString}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Request failed")
        return res.json()
      })
      .then((data) => setServices(data.data ?? data))
      .catch((err) => {
        if (err.name !== "AbortError")
          setError("We couldn't load services. Please try again.")
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [queryString, attempt])
  console.log(services)
  return { services, loading, error, retry: () => setAttempt((a) => a + 1) }
}
