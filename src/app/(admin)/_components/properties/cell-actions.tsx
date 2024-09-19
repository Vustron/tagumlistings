"use client"

// components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

// hooks
import { useDeleteProperty } from "@/app/(admin)/_hooks/use-delete-property"
import { useConfirm } from "@/lib/hooks/use-confirm"
import { useRouter } from "next/navigation"

// utils
import { clientErrorHandler } from "@/lib/utils"
import { toast } from "react-hot-toast"

// types
import type { Property } from "@/app/(admin)/_components/data/properties"

interface CellActionProps {
  data: Property
}

const CellActions = ({ data }: CellActionProps) => {
  // init router
  const router = useRouter()
  const deleteMutation = useDeleteProperty(data?.id!)

  const isPending = deleteMutation.isPending

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this property",
  )

  const handleDelete = async () => {
    const ok = await confirm()

    if (ok) {
      await toast.promise(deleteMutation.mutateAsync(), {
        loading: <span className="animate-pulse">Deleting property...</span>,
        success: "Property deleted",
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
            onClick={() => router.push(`/admin/properties/${data.id}`)}
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
