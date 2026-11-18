"use client"
import { authClient } from "@/lib/auth-client"

import { DropdownMenuAvatar } from "./user-dropdown"
import Link from "next/link"
import { SkeletonAvatar } from "./skeleton-avatar"

const AuthNav = () => {
  const { data: session, isPending } = authClient.useSession()
  if (isPending) {
    return <SkeletonAvatar />
  }
  return (
    <div>
      {session?.user ? (
        <DropdownMenuAvatar />
      ) : (
        <>
          <Link href="/sign-in">Login</Link>
          <Link href="/sign-up">Sign up</Link>
        </>
      )}
    </div>
  )
}

export default AuthNav
