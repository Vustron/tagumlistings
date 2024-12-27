"use client"

// components
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import CreateAppointmentDialog from "@/components/agent/appointments/create"
import { Coins, Edit, MoreHorizontal, PlusIcon, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

// hooks
import { useGetAppointmentDates } from "@/lib/hooks/appointment/get-dates"
import { useGetAppointments } from "@/lib/hooks/appointment/get-all"
import { useDeleteProperty } from "@/lib/hooks/property/delete"
import { useConfirm } from "@/lib/hooks/utils/use-confirm"
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

// utils
import { clientErrorHandler } from "@/lib/utils"
import { toast } from "react-hot-toast"

// types
import type { Property } from "@/lib/types"

interface CellActionProps {
  data: Property
}

const CellActions = ({ data }: CellActionProps) => {
  const router = useRouter()
  const deleteMutation = useDeleteProperty(data?.id!)
  const { data: appointmentsData } = useGetAppointments()
  const { data: datesData } = useGetAppointmentDates()

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

  const [createAppointmentDialogOpen, setIsCreateAppointmentDialogOpen] =
    useState(false)
  const [availableDates, setAvailableDates] = useState<Date[]>([])

  const setAppointmentDates = (dates: Date[]) => {
    setAvailableDates(dates)
    setIsCreateAppointmentDialogOpen(false)
  }

  return (
    <>
      <ConfirmDialog />
      <CreateAppointmentDialog
        isOpen={createAppointmentDialogOpen}
        onOpenChange={setIsCreateAppointmentDialogOpen}
        setAvailableDates={setAppointmentDates}
        initialDates={availableDates}
        appointments={appointmentsData.appointments}
        appointmentDates={datesData.dates}
        propertyId={data.id}
      />

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
            onClick={() =>
              router.push(
                `/admin/transactions/new?property=${encodeURIComponent(
                  data.location!,
                )}&price=${encodeURIComponent(data.price!)}`,
              )
            }
          >
            <Coins className="mr-2 size-4" /> Add payment
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsCreateAppointmentDialogOpen(true)}
          >
            <PlusIcon className="mr-2 size-4" aria-hidden="true" />
            Add Appointment
          </DropdownMenuItem>

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
