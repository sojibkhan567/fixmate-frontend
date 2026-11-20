"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getTokenFromClient } from "@/lib/getTokenFromClient"
import { toast } from "react-toastify"

export type Role = "customer" | "technician" | "admin"

export type User = {
  id: string
  name: string
  email: string
  image?: string | null
  role: Role
  createdAt: string
}

const ROLES: { value: Role; label: string }[] = [
  { value: "customer", label: "Customer" },
  { value: "technician", label: "Technician" },
  { value: "admin", label: "Admin" },
]

const ROLE_FILTER_ITEMS = [{ value: "all", label: "All Roles" }, ...ROLES]

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString(undefined, { dateStyle: "medium" })

type Props = {
  users: User[]
  currentUserId: string // the signed-in admin: their role can't be changed
}

export function UsersTable({ users: initialUsers, currentUserId }: Props) {
  const [users, setUsers] = useState(initialUsers)
  const [query, setQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter(
      (u) =>
        (roleFilter === "all" || u.role === roleFilter) &&
        (!q || `${u.name} ${u.email}`.toLowerCase().includes(q))
    )
  }, [users, query, roleFilter])

  async function changeRole(user: User, role: Role) {
    if (user.id === currentUserId || user.role === role) return

    const previous = user.role

    // Optimistic UI update
    setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, role } : u)))

    try {
      const token = await getTokenFromClient()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/role`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || "Could not change the role.")
      }

      // Update with the server's returned user if available
      if (data?.data) {
        setUsers((list) =>
          list.map((u) =>
            u.id === user.id
              ? {
                  ...u,
                  ...data.data,
                  id: data.data.id ?? u.id,
                }
              : u
          )
        )
      }

      toast.success(`${user.name} is now ${role}`)
    } catch (error) {
      // Rollback optimistic update
      setUsers((list) =>
        list.map((u) => (u.id === user.id ? { ...u, role: previous } : u))
      )

      toast.error(
        error instanceof Error ? error.message : "Could not change the role."
      )
    }
  }

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          {users.length} user{users.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email…"
              aria-label="Search users"
              className="h-10 pl-9"
            />
          </div>
          <Select
            items={ROLE_FILTER_ITEMS}
            value={roleFilter}
            onValueChange={(v) => v && setRoleFilter(v as Role | "all")}
          >
            <SelectTrigger
              className="h-10 w-full sm:w-40"
              aria-label="Filter by role"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12 w-16 font-semibold text-foreground">
                Photo
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Name
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Email
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Role
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Joined
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="h-40 text-center text-sm text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((u) => {
                const isSelf = u.id === currentUserId
                return (
                  <TableRow key={u.id} className="h-15.25">
                    <TableCell>
                      <Avatar className="size-9">
                        {u.image && <AvatarImage src={u.image} alt={u.name} />}
                        <AvatarFallback className="bg-green-100 text-xs font-medium text-green-700 dark:bg-green-500/20 dark:text-green-300">
                          {initials(u.name)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium">
                        {u.name}
                        {isSelf && (
                          <Badge
                            variant="secondary"
                            className="rounded-full bg-amber-300 px-2 text-xs font-medium"
                          >
                            You
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {u.email}
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        {/* span so the tooltip still works on a disabled select */}
                        <TooltipTrigger
                          render={<span className="inline-block" />}
                        >
                          <Select
                            items={ROLES}
                            value={u.role}
                            disabled={isSelf}
                            onValueChange={(v) => v && changeRole(u, v as Role)}
                          >
                            <SelectTrigger
                              className="h-8 w-36"
                              aria-label={`Role for ${u.name}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLES.map((r) => (
                                <SelectItem key={r.value} value={r.value}>
                                  {r.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TooltipTrigger>
                        {isSelf && (
                          <TooltipContent>
                            You can’t change your own role
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatDate(u.createdAt)}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
