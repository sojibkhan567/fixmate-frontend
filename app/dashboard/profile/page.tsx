import ProfileForm from "@/components/profile/profile-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Profile | Dashboard",
  description: "View and update your name, phone, area, bio and profile photo.",
  robots: { index: false, follow: false }, // private dashboard page
}

export default function ProfilePage() {
  return <ProfileForm />
}
