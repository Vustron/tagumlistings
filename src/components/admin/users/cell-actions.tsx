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
import { useDeleteAccount } from "@/lib/hooks/auth/delete"
import { useConfirm } from "@/lib/hooks/utils/use-confirm"
import { useRouter } from "next-nprogress-bar"

// utils
import { clientErrorHandler } from "@/lib/utils"
import { toast } from "react-hot-toast"

// types
import type { UserData } from "@/lib/types"

interface CellActionProps {
  data: UserData
}

const CellActions = ({ data }: CellActionProps) => {
  const router = useRouter()
  const deleteMutation = useDeleteAccount(data.id)

  const isPending = deleteMutation.isPending

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this account",
  )

  const handleDelete = async () => {
    const ok = await confirm()

    if (ok) {
      await toast.promise(deleteMutation.mutateAsync(), {
        loading: <span className="animate-pulse">Deleting account...</span>,
        success: "Account deleted",
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

          <DropdownMenuItem
            onClick={() => router.push(`/admin/users/${data.id}`)}
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
