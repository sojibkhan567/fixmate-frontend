import { ServiceApproval } from "@/components/admin/service-approval"

export const metadata = { title: "Service Approval" }

// The dashboard layout already provides <main> and the page title in the header.
export default function ServiceApprovalPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <ServiceApproval />
    </div>
  )
}
