"use client"

// components
import CellActions from "@/components/admin/payments/cell-actions"

// utils
import { formatPriceToPHP } from "@/lib/utils"

// types
import type { ColumnDef } from "@tanstack/react-table"
import type { Payment } from "@/lib/types"

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "property",
    header: "Property",
    cell: ({ row }) => {
      const property = row.original.property
      return (
        <div className="flex flex-col">
          <span className="font-medium">{property}</span>
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
          <span className="font-medium">{user}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "appointment",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original.appointment
      return (
        <div className="flex flex-col">
          <span className="font-medium">{appointment}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "paid_date",
    header: "Date",
    cell: ({ row }) => {
      const paid_date = row.original.paid_date
      return (
        <div className="flex flex-col">
          <span className="font-medium">{paid_date}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const rawAmount = row.original.amount
      if (!rawAmount) return "₱0.00"

      try {
        return formatPriceToPHP(rawAmount)
      } catch {
        return "₱0.00"
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
]
