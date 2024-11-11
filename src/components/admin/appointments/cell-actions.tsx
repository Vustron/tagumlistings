"use client"

// components
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
  // Eye,
  Trash,
  Clock,
  XCircle,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
// import { ViewPropertyDialog } from "@/components/admin/appointments/view-property"

// hooks
import { useUpdateAppointment } from "@/lib/hooks/appointment/update"
import { useDeleteAppointment } from "@/lib/hooks/appointment/delete"
import { useUpdateProperty } from "@/lib/hooks/property/update"
import { useConfirm } from "@/lib/hooks/utils/use-confirm"
// import { useState } from "react"

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
  const updateAppointmentMutation = useUpdateAppointment(data.id!)
  const updatePropertyMutation = useUpdateProperty(data.propertyId!)

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to remove this appointment",
  )

  // const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const handleDelete = async () => {
    const ok = await confirm()

    if (ok) {
      await toast.promise(
        deleteMutation.mutateAsync(data.id!).then(() => Promise.all([])),
        {
          loading: (
            <span className="animate-pulse">Deleting appointment...</span>
          ),
          success: "Appointment deleted",
          error: (error: unknown) => clientErrorHandler(error),
        },
      )
    }
  }

  const handleStatusChange = async (status: string) => {
    const updateAppointmentPromise = updateAppointmentMutation.mutateAsync({
      id: data.id,
      user: data.user,
      date: data.date.toString(),
      description: data.description,
      color: data.color,
      status,
      propertyId: data.propertyId,
    })

    const updatePropertyPromise =
      status === "confirmed"
        ? updatePropertyMutation.mutateAsync({
            id: data.propertyId,
            status: "reserved",
            user: data.user,
            appointment_id: data.id,
          })
        : Promise.resolve()

    await toast.promise(
      Promise.all([updateAppointmentPromise, updatePropertyPromise]),
      {
        loading: <span className="animate-pulse">Updating appointment...</span>,
        success: "Appointment updated",
        error: (error: unknown) => clientErrorHandler(error),
      },
    )
  }

  return (
    <>
      <ConfirmDialog />
      {/* <ViewPropertyDialog
        propertyId={data.propertyId!}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      /> */}
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
          {/* <DropdownMenuItem onClick={() => setIsViewModalOpen(true)}>
            <Eye className="mr-2 size-4" /> View
          </DropdownMenuItem> */}
          <DropdownMenuGroup>
            <DropdownMenuLabel>Set Status</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleStatusChange("pending")}
              className={
                data.status === "pending" ? "bg-gray-200 dark:bg-gray-700" : ""
              }
            >
              <Clock className="mr-2 size-4" /> Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange("confirmed")}
              className={
                data.status === "confirmed"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }
            >
              <CheckCircle className="mr-2 size-4" /> Confirmed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange("denied")}
              className={
                data.status === "denied" ? "bg-gray-200 dark:bg-gray-700" : ""
              }
            >
              <XCircle className="mr-2 size-4" /> Denied
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default CellActions
