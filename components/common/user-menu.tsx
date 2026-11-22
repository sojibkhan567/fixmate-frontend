"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react"
import { useAuth, type AuthUser } from "@/hooks/use-auth"
import { ROLE_LABEL } from "@/lib/dashboard-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U"

export function UserAvatar({
  user,
  className = "size-9",
}: {
  user: AuthUser
  className?: string
}) {
  return (
    <Avatar className={`${className} ring-2 ring-amber-200`}>
      {user.image && <AvatarImage src={user.image} alt={user.name} />}
      <AvatarFallback className="bg-amber-500 text-sm font-semibold text-amber-950">
        {initialsOf(user.name)}
      </AvatarFallback>
    </Avatar>
  )
}

/**
 * Avatar button that opens a dropdown with the user's name + email and
 * Dashboard · Profile · Sign out.
 */
export function UserMenu({
  user,
  redirectTo = "/",
}: {
  user: AuthUser
  redirectTo?: string
}) {
  const router = useRouter()
  const { signOut } = useAuth()
  const base = `/dashboard/${user.role}`

  async function handleSignOut() {
    await signOut()
    router.replace(redirectTo)
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Open user menu"
            className="flex items-center gap-2.5 rounded-full p-0.5 transition-colors hover:bg-amber-50 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none data-popup-open:bg-amber-50 lg:border lg:border-amber-200 lg:py-1 lg:pr-3 lg:pl-1"
          />
        }
      >
        <UserAvatar user={user} />
        {/* name + email only on large screens; small screens show just the avatar */}
        <span className="hidden min-w-0 text-left leading-tight lg:grid">
          <span className="max-w-40 truncate text-sm font-medium">
            {user.name}
          </span>
          <span className="max-w-40 truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </span>
        <ChevronDown className="hidden size-4 text-muted-foreground lg:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="min-w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-3 py-1">
              <UserAvatar user={user} className="size-10" />
              <div className="grid min-w-0 leading-tight">
                <span className="truncate text-sm font-semibold text-foreground">
                  {user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
                <span className="mt-1 w-fit rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-amber-900 uppercase">
                  {ROLE_LABEL[user.role]}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href={base} />}>
            <LayoutDashboard /> Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={`${base}/profile`} />}>
            <UserRound /> Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <LogOut /> Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
