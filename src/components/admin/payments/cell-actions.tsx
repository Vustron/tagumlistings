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
import { useDeletePayment } from "@/lib/hooks/payment/delete"
import { useConfirm } from "@/lib/hooks/utils/use-confirm"
import { useRouter } from "next-nprogress-bar"

// utils
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"

// types
import type { Payment } from "@/lib/types"

interface CellActionProps {
  data: Payment
}

const CellActions = ({ data }: CellActionProps) => {
  const router = useRouter()
  const deleteMutation = useDeletePayment(data.id)

  const isPending = deleteMutation.isPending

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this payment",
  )

  const handleDelete = async () => {
    const ok = await confirm()

    if (ok) {
      await toast.promise(deleteMutation.mutateAsync(), {
        loading: <span className="animate-pulse">Deleting payment...</span>,
        success: "Payment deleted",
        error: (error: unknown) => clientErrorHandler(error),
      })
    }
  }

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/admin/transactions/${data.id}`)}
          >
            <Edit className="mr-2 size-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} disabled={isPending}>
            <Trash className="mr-2 size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default CellActions
