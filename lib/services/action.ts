"use server"

import { revalidatePath } from "next/cache"
import { API_URL, SERVICES_PATH } from "./api"

type Result = { ok: true } | { ok: false; error: string }

// PATCH /admin/services/:id  { approvalStatus: 'approved' | 'rejected' }
export async function updateServiceStatus(
  id: string,
  approvalStatus: "approved" | "rejected"
): Promise<Result> {
  //console.log(id)
  try {
    const res = await fetch(`${API_URL}${SERVICES_PATH}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ approvalStatus }),
      cache: "no-store",
    })
    if (!res.ok) return { ok: false, error: "Could not update the service." }
  } catch {
    return { ok: false, error: "Could not reach the server." }
  }

  revalidatePath("/dashboard/admin/services")
  return { ok: true }
}
