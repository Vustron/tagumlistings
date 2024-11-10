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
    cell: ({ row }) => truncateText(row.getValue("category") || "N/A", 20),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => truncateText(row.getValue("location") || "N/A", 20),
  },
  {
    accessorKey: "status",
    header: "Status",
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
    header: "Reservation Fee",
    cell: ({ row }) => {
      const price = row.getValue("price") as string
      return formatPriceToPHP(price || "0")
    },
  },
  {
    accessorKey: "no_of_bedrooms",
    header: "Bedrooms",
    cell: ({ row }) => row.getValue("no_of_bedrooms") || "N/A",
  },
  {
    accessorKey: "no_of_bathrooms",
    header: "Bathrooms",
    cell: ({ row }) => row.getValue("no_of_bathrooms") || "N/A",
  },
  {
    accessorKey: "square_meter",
    header: "Area (sqm)",
    cell: ({ row }) => row.getValue("square_meter") || "N/A",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
]
