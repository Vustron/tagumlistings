"use client"

// components
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

// hooks
import { useRouter } from "next/navigation"

// types
import type { Payment } from "@/lib/types"

interface CellActionProps {
  data: Payment
}

const CellActions = ({ data }: CellActionProps) => {
  // init router
  const router = useRouter()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem onClick={() => router.push(`/payments/${data.id}}`)}>
          <Edit className="mr-2 size-4" /> Update
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Trash className="mr-2 size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CellActions
