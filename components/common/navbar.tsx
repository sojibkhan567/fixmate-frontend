"use client"

import Link from "next/link"
import {
  ChartColumn,
  Clock,
  DollarSign,
  LayoutDashboard,
  Menu,
  Users,
  X,
} from "lucide-react"
import { useState } from "react"
import Logo from "./logo"
import AuthNav from "./auth-nav"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-transparent bg-white/80 backdrop-blur transition-all duration-200 dark:bg-gray-950/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          <Link
            className="group flex min-w-0 shrink-0 items-center gap-2.5"
            href={"/"}
          >
            <Logo />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
            <Link
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-150 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white"
              href={"/services"}
            >
              <LayoutDashboard className="h-4 w-4" />
              Services
            </Link>
            <Link
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-150 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white"
              href={"/dashboard"}
            >
              <Users className="h-4 w-4" />
              Employees
            </Link>
            <Link
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-150 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white"
              href={"/dashboard"}
            >
              <Clock className="h-4 w-4" />
              Attendance
            </Link>
            <Link
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-150 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white"
              href={"/dashboard"}
            >
              <DollarSign className="h-4 w-4" />
              Payroll
            </Link>
            <Link
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-150 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white"
              href={"/dashboard"}
            >
              <ChartColumn className="h-4 w-4" />
              Reports
            </Link>
          </nav>

          <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-1.5">
            <AuthNav />
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="[&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 inline-flex size-9 shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:hidden dark:hover:bg-accent/50 dark:aria-invalid:ring-destructive/40"
              aria-label="Toggle menu"
              aria-expanded="false"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/** mobile menu */}
        {isOpen && (
          <div className="space-y-0.5 border-t border-border py-3 pb-4 md:hidden">
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-150 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white"
              href={"/dashboard"}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-150 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white"
              href={"/dashboard"}
            >
              <Users className="h-4 w-4" />
              Employees
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-150 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white"
              href={"/dashboard"}
            >
              <Clock className="h-4 w-4" />
              Attendance
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-150 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white"
              href={"/dashboard"}
            >
              <DollarSign className="h-4 w-4" />
              Payroll
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-150 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white"
              href={"/dashboard"}
            >
              <ChartColumn className="h-4 w-4" />
              Reports
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
