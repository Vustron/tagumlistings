"use client"

// components
import AppointmentCalendar from "@/app/(admin)/_components/appointments/calendar"
import { Loader2, ServerCrash } from "lucide-react"

// hooks
import { useGetAppointments } from "@/app/(admin)/_hooks/appointment/get-all"
import { useGetAppointmentDates } from "@/app/(admin)/_hooks/appointment/get-dates"

const AppointmentsClient = () => {
  const { data: appointmentsData, status, isLoading } = useGetAppointments()
  const {
    data: datesData,
    status: datesStatus,
    isLoading: datesLoading,
  } = useGetAppointmentDates()

  return (
    <div className="mt-6 mb-2">
      {(isLoading || datesLoading) && (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      )}

      {(status === "error" || datesStatus === "error") && (
        <div className="flex flex-col items-center justify-center">
          <ServerCrash className="size-7 text-zinc-500 my-4" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Something went wrong!
          </p>
        </div>
      )}

      {status === "success" && appointmentsData && (
        <AppointmentCalendar
          events={appointmentsData.appointments}
          appointmentDates={datesData.dates}
        />
      )}
    </div>
  )
}

export default AppointmentsClient
