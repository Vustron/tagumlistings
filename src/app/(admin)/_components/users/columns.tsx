"use client"

// components
import CellActions from "@/app/(admin)/_components/users/cell-actions"
import { Checkbox } from "@/components/ui/checkbox"

// types
import type { User } from "@/app/(admin)/_components/data/users"
import { Badge } from "@/components/ui/badge"
import { getRoleBadgeColor } from "@/lib/utils"
import type { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <Badge className={`${getRoleBadgeColor(role)} font-medium`}>
          {role}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
]
