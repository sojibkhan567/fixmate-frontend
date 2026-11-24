import { Transactions } from "@/components/admin/transactions"

export const metadata = { title: "Transactions" }

// The dashboard layout already provides <main> and the page title in the header.
export default function TransactionsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Transactions />
    </div>
  )
}
