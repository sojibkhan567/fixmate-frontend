import { Role } from "@/types"
import {
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  ShieldCheck,
  UserRound,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  exact?: boolean
}

export const ROLE_LABEL: Record<Role, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
}

/** Edit hrefs to match the pages you build. */
export function getNav(role: Role): NavItem[] {
  const base = `/dashboard/${role}`
  const overview: NavItem = {
    label: "Overview",
    href: base,
    icon: LayoutDashboard,
    exact: true,
  }
  const profile: NavItem = {
    label: "Profile",
    href: `${base}/profile`,
    icon: UserRound,
  }

  switch (role) {
    case "customer":
      return [
        overview,
        { label: "My Bookings", href: `${base}/bookings`, icon: CalendarCheck },
        profile,
      ]
    case "technician":
      return [
        overview,
        { label: "My Services", href: `${base}/my-services`, icon: Wrench },
        {
          label: "Add Service",
          href: `${base}/add-services`,
          icon: PlusCircle,
        },
        {
          label: "Booking Requests",
          href: `${base}/bookings`,
          icon: ClipboardList,
        },
        profile,
      ]
    case "admin":
      return [
        overview,
        { label: "Manage Users", href: `${base}/users`, icon: Users },
        {
          label: "Service Approvals",
          href: `${base}/services`,
          icon: ShieldCheck,
        },
        { label: "All Bookings", href: `${base}/bookings`, icon: ListChecks },
        profile,
      ]
  }
}

export const isActive = (pathname: string, item: NavItem) =>
  item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`)
