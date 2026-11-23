import type { ServicePayload } from "@/lib/validations/service"
import { getTokenFromClient } from "../getTokenFromClient"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000" // "" = Next.js route handler

export async function createService(payload: ServicePayload) {
  const token = await getTokenFromClient()
  const res = await fetch(`${BASE_URL}/services`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message ?? "Failed to add service")
  return data as { insertedId: string }
}

/** Uploads a file to ImgBB and returns the hosted image URL. */
export async function uploadToImgBB(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY
  if (!key) throw new Error("Missing NEXT_PUBLIC_IMGBB_API_KEY")

  const body = new FormData()
  body.append("image", file)

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body,
  })
  const data = await res.json()
  if (!res.ok || !data?.data?.url) throw new Error("Image upload failed")
  return data.data.url as string
}
