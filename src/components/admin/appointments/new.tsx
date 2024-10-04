"use client"

// components
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog"
import NewAppointmentForm from "@/components/admin/appointments/form"
import FallbackBoundary from "@/components/shared/fallback-boundary"

// hooks
import { useGetAccounts } from "@/lib/hooks/auth/get-all"

// types
import type { AppointmentDate } from "@/lib/types"

interface NewAppointmentDialog {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  appointmentDates: AppointmentDate[]
}

const NewAppointment = ({
  isOpen,
  onOpenChange,
  appointmentDates,
}: NewAppointmentDialog) => {
  const { data } = useGetAccounts()
  const accountsData = data?.accounts ?? []

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Appointment</DialogTitle>
        </DialogHeader>

        <FallbackBoundary>
          <NewAppointmentForm
            accounts={accountsData}
            appointmentDates={appointmentDates}
          />
        </FallbackBoundary>
      </DialogContent>
    </Dialog>
  )
}

export default NewAppointment
