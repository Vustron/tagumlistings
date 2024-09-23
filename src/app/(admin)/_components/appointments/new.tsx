"use client"

// components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import NewAppointmentForm from "@/app/(admin)/_components/appointments/form"
import { Loader2, ServerCrash } from "lucide-react"

// hooks
import { useGetAccounts } from "@/app/(auth)/_hooks/auth/get-all"

// types
import type { AppointmentDate } from "@/app/(admin)/_components/appointments/date"

export type Appointment = Omit<Event, "id"> & {
  id?: string
  user: string
  date: Date
  description: string
  color: string
}

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
  const { data, status, isLoading } = useGetAccounts()
  const accountsData = data?.accounts ?? []

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Appointment</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="size-10 animate-spin" />
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center">
            <ServerCrash className="size-7 text-zinc-500 my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Something went wrong!
            </p>
          </div>
        )}

        {status === "success" && accountsData && (
          <NewAppointmentForm
            accounts={accountsData}
            appointmentDates={appointmentDates}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default NewAppointment
