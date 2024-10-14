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
import { useUpdateProperty } from "@/lib/hooks/property/update"
import { useSession } from "@/components/providers/session"
import { useUpdateAccount } from "@/lib/hooks/auth/update"
import { useConfirm } from "@/lib/hooks/utils/use-confirm"
import { useGetAccount } from "@/lib/hooks/auth/get"

// utils
import { clientErrorHandler } from "@/lib/utils"
import { toast } from "react-hot-toast"

// types
import type { Property } from "@/lib/types"

interface CellActionProps {
  data: Property
}

const CellActions = ({ data }: CellActionProps) => {
  const session = useSession()
  const updateAccount = useUpdateAccount(session?.id)
  const { data: userData } = useGetAccount(session?.id!)
  const updateProperty = useUpdateProperty(data.id)

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to remove this reserved property",
  )

  const handleDelete = async () => {
    const ok = await confirm()

    if (ok) {
      const updatedReservedProperties =
        userData?.reservedProperties?.filter((prop) => prop.id !== data.id) ||
        []

      await toast.promise(
        Promise.all([
          updateAccount.mutateAsync({
            id: session?.id,
            name: session?.name,
            email: session?.email,
            contact_number: session?.contact_number,
            reservedProperties: updatedReservedProperties,
          }),
          updateProperty.mutateAsync({
            id: data.id,
            category: data.category,
            location: data.location,
            status: "available",
            propertyPics: data.propertyPics,
            no_of_bedrooms: data.no_of_bedrooms,
            no_of_bathrooms: data.no_of_bathrooms,
            square_meter: data.square_meter,
          }),
        ]),
        {
          loading: <span className="animate-pulse">Processing...</span>,
          success: "Reserved property removed successfully",
          error: (error: unknown) => clientErrorHandler(error),
        },
      )
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
