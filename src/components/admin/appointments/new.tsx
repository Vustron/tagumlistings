"use client"

// components
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog"
import { ErrorFallback, LoadingFallback } from "@/components/shared/fallback"
import NewAppointmentForm from "@/components/admin/appointments/form"

// hooks
import { useGetAccounts } from "@/lib/hooks/auth/get-all"

// utils
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"

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

        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingFallback />}>
            <NewAppointmentForm
              accounts={accountsData}
              appointmentDates={appointmentDates}
            />
          </Suspense>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  )
}

export default NewAppointment
