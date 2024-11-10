"use client"

// components
import CellActions from "@/components/admin/properties/cell-actions"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

// utils
import { formatPriceToPHP, getRoleBadgeColor, truncateText } from "@/lib/utils"

// types
import type { ColumnDef } from "@tanstack/react-table"
import type { Property } from "@/lib/types"

export const columns: ColumnDef<Property>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="whitespace-nowrap">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
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
    header: () => <div className="whitespace-nowrap">Category</div>,
    cell: ({ row }) => truncateText(row.getValue("category") || "N/A", 20),
  },
  {
    accessorKey: "location",
    header: () => <div className="whitespace-nowrap">Location</div>,
    cell: ({ row }) => truncateText(row.getValue("location") || "N/A", 20),
  },
  {
    accessorKey: "status",
    header: () => <div className="whitespace-nowrap">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge className={`${getRoleBadgeColor(status)} font-medium`}>
          {truncateText(status || "Unknown", 20)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="whitespace-nowrap">Reservation Fee</div>,
    cell: ({ row }) => {
      const price = row.getValue("price") as string
      return formatPriceToPHP(price || "0")
    },
  },
  {
    accessorKey: "no_of_bedrooms",
    header: () => <div className="whitespace-nowrap">Bedrooms</div>,
    cell: ({ row }) => row.getValue("no_of_bedrooms") || "N/A",
  },
  {
    accessorKey: "no_of_bathrooms",
    header: () => <div className="whitespace-nowrap">Bathrooms</div>,
    cell: ({ row }) => row.getValue("no_of_bathrooms") || "N/A",
  },
  {
    accessorKey: "square_meter",
    header: () => <div className="whitespace-nowrap">Area (sqm)</div>,
    cell: ({ row }) => row.getValue("square_meter") || "N/A",
  },
  {
    accessorKey: "user",
    header: () => <div className="whitespace-nowrap">Reserved user</div>,
    cell: ({ row }) => truncateText(row.getValue("user") || "N/A", 20),
  },
  {
    id: "actions",
    header: () => <div className="whitespace-nowrap">Actions</div>,
    cell: ({ row }) => <CellActions data={row.original} />,
  },
]
