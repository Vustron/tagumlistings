"use client"

// components
import CellActions from "@/components/admin/appointments/cell-actions"

// utils
import { format } from "date-fns/format"

// types
import type { ColumnDef } from "@tanstack/react-table"
import type { Appointment } from "@/lib/types"

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "user",
    header: "Client",
    cell: ({ row }) => row.original.user,
  },
  {
    accessorKey: "date",
    header: "Appointment Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date)
      return format(date, "PPP")
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original.description
      return description.length > 50
        ? `${description.slice(0, 50)}...`
        : description
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            status === "confirmed"
              ? "bg-green-200 text-green-800"
              : status === "pending"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-red-200 text-red-800"
          }`}
        >
          {(status ?? "Pending").charAt(0).toUpperCase() +
            (status ?? "Pending").slice(1)}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
    header: "Actions",
  },
]
