"use client"

// components
import CellActions from "@/app/(admin)/_components/properties/cell-actions"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

// utils
import { getRoleBadgeColor } from "@/lib/utils"

// types
import type { Property } from "@/app/(admin)/_components/data/properties"
import type { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Property>[] = [
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
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge className={`${getRoleBadgeColor(status)} font-medium`}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
]
