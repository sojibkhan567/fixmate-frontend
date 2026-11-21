export type BookingStatus =
  | "requested"
  | "inprogress"
  | "completed"
  | "cancelled"
  | "rejected"
  | "accepted"

export interface Booking {
  _id?: string
  serviceId: string
  service: {
    title: string
    image: string
    category: string
  }
  basePrice: number
  technician: {
    name: string
    email: string
  }
  customer: {
    name: string
    email: string
  }
  phone: string
  address: string
  preferredDate: string
  problemDescription: string
  finalAmount: number
  status: BookingStatus
  paymentStatus: "unpaid" | "paid"
  createdAt: string | Date
  updatedAt: string | Date
}
