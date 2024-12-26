"use client"

// components
import AppointmentCalendar from "@/components/admin/appointments/calendar"
import FallbackBoundary from "@/components/shared/fallback-boundary"

// hooks
import { useQueryAppointments } from "@/lib/hooks/appointment/query-appointments"

const AppointmentsClient = () => {
  const { appointments, appointmentDates } = useQueryAppointments()
  return (
    <div className="mt-6 mb-2">
      <FallbackBoundary>
        <AppointmentCalendar
          events={appointments}
          appointmentDates={appointmentDates}
        />
      </FallbackBoundary>
    </div>
  )
}

export default AppointmentsClient
