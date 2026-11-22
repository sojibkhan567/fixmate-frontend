import { ManageRequests } from "@/components/requests/manage-requests"

export const metadata = { title: "Manage Requests" }

// The dashboard layout already provides <main> and the page title in the header.
export default function ManageRequestsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <p className="mb-6 text-muted-foreground">
        Review repair requests for your services and move each job through to
        completion.
      </p>
      <ManageRequests />
    </div>
  )
}
