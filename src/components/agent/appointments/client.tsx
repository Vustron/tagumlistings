"use client"

// components
import AppointmentCalendar from "@/components/agent/appointments/calendar"
import FallbackBoundary from "@/components/shared/fallback-boundary"

// Hooks
import { useQueryAppointments } from "@/lib/hooks/appointment/query-appointments"
import { useSession } from "@/components/providers/session"
import { useMemo } from "react"

const AppointmentsClient = () => {
  const session = useSession()
  const { appointments, appointmentDates } = useQueryAppointments()

  const filteredAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) => appointment.agent === session.name,
    )
  }, [appointments, session.name])

  return (
    <div className="mt-6 mb-2">
      <FallbackBoundary>
        <AppointmentCalendar
          events={filteredAppointments}
          appointmentDates={appointmentDates}
        />
      </FallbackBoundary>
    </div>
  )
}

export default AppointmentsClient
