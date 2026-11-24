import { AllBookings } from "@/components/admin/all-bookings"

export const metadata = { title: "All Bookings" }

// The dashboard layout already provides <main> and the page title in the header.
export default function AllBookingsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <AllBookings />
    </div>
  )
}
