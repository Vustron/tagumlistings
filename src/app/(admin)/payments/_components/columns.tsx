"use client"

// components
import CellActions from "@/app/(admin)/payments/_components/cell-actions"
import { Checkbox } from "@/components/ui/checkbox"

// utils
import { formatDate } from "@/lib/utils"

// types
import type { Payments } from "@/app/(admin)/payments/constants"
import type { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Payments>[] = [
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
    accessorKey: "property",
    header: "Property",
    cell: ({ row }) => {
      const property = row.original.property
      return (
        <div className="flex flex-col">
          <span className="font-medium">{property.location}</span>
          <span className="text-xs text-gray-500">{property.id}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "appointment",
    header: "Appointment",
    cell: ({ row }) => formatDate(row.original.appointment),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.original.amount)
      return `₱${amount.toFixed(2)}`
    },
  },
  {
    accessorKey: "paid_date",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.paid_date),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
]
