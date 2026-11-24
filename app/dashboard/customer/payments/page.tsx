import { PaymentHistory } from "@/components/payments/payment-history"

export const metadata = { title: "Payment History" }

// The dashboard layout already provides <main> and the page title in the header.
export default function PaymentHistoryPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PaymentHistory />
    </div>
  )
}
