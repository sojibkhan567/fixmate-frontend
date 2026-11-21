import { MyBookings } from "@/components/bookings/my-bookings"

export const metadata = { title: "My Bookings" }

export default function MyBookingsPage() {
  return (
    <div className="px-4 py-4 sm:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">My Bookings</h1>
        <p className="mt-1 text-muted-foreground">
          Track your repair requests, cancel pending ones, and pay for completed
          work.
        </p>
      </header>
      <MyBookings />
    </div>
  )
}
