"use client"

// components
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

// hooks
import { useDeleteAppointment } from "@/lib/hooks/appointment/delete"
import { useConfirm } from "@/lib/hooks/utils/use-confirm"

// utils
import { clientErrorHandler } from "@/lib/utils"
import { toast } from "react-hot-toast"

// types
import type { Appointment } from "@/lib/types"

interface CellActionProps {
  data: Appointment
}

const CellActions = ({ data }: CellActionProps) => {
  const deleteMutation = useDeleteAppointment()

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to remove this appointment",
  )

  const handleDelete = async () => {
    const ok = await confirm()

    if (ok) {
      await toast.promise(deleteMutation.mutateAsync(data.id!), {
        loading: <span className="animate-pulse">Deleting appointment...</span>,
        success: "Appointment deleted",
        error: (error: unknown) => clientErrorHandler(error),
      })
    }
  }

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleDelete}>
            <Trash className="mr-2 size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default CellActions
