"use client"

// components
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import CellActions from "@/components/agent/records/cell-actions"

// utils
import { formatPriceToPHP } from "@/lib/utils"
import { cn } from "@/lib/utils"

// types
import type { ColumnDef } from "@tanstack/react-table"
import type { Payment } from "@/lib/types"

const getStatusColor = (status: string | null | undefined) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "property",
    header: "Property",
    cell: ({ row }) => {
      const property = row.original.property
      const truncated =
        property.length > 25 ? `${property.slice(0, 25)}...` : property

      return (
        <div className="flex items-start">
          <Tooltip>
            <TooltipTrigger className="text-left">
              <span className="font-medium">{truncated}</span>
            </TooltipTrigger>
            {property.length > 25 && (
              <TooltipContent className="p-2">
                <p>{property}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      )
    },
  },
  {
    accessorKey: "user",
    header: "Client",
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
    accessorKey: "agent",
    header: "Agent",
    cell: ({ row }) => {
      const agent = row.original.agent
      return (
        <div className="flex flex-col">
          <span className="font-medium">{agent || "N/A"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "paid_date",
    header: "Paid Date",
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
      return formatPriceToPHP(rawAmount)
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "pending"
      return (
        <div className="flex items-center">
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
              getStatusColor(status),
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
]
