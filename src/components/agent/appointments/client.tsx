"use client"

// components
import AppointmentCalendar from "@/components/agent/appointments/calendar"
import FallbackBoundary from "@/components/shared/fallback-boundary"

// Hooks
import { useGetAppointmentDates } from "@/lib/hooks/appointment/get-dates"
import { useGetAppointments } from "@/lib/hooks/appointment/get-all"
import { useSession } from "@/components/providers/session"
import { useMemo } from "react"

const AppointmentsClient = () => {
  const session = useSession()
  const { data: appointments } = useGetAppointments()
  const { data: appointmentDates } = useGetAppointmentDates()

  const filteredAppointments = useMemo(() => {
    return appointments.appointments.filter(
      (appointment) => appointment.agent === session.name,
    )
  }, [appointments, session.name])

  return (
    <div className="mt-6 mb-2">
      <FallbackBoundary>
        <AppointmentCalendar
          events={filteredAppointments}
          appointmentDates={appointmentDates.dates}
        />
      </FallbackBoundary>
    </div>
  )
}

export default AppointmentsClient
