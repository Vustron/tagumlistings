"use client"

// components
import AppointmentCalendar from "@/components/admin/appointments/calendar"
import FallbackBoundary from "@/components/shared/fallback-boundary"

// hooks
import { useGetAppointmentDates } from "@/lib/hooks/appointment/get-dates"
import { useGetAppointments } from "@/lib/hooks/appointment/get-all"

const AppointmentsClient = () => {
  const { data: appointmentsData } = useGetAppointments()
  const { data: appointmentDatesData } = useGetAppointmentDates()
  return (
    <div className="mt-6 mb-2">
      <FallbackBoundary>
        <AppointmentCalendar
          events={appointmentsData.appointments}
          appointmentDates={appointmentDatesData.dates}
        />
      </FallbackBoundary>
    </div>
  )
}

export default AppointmentsClient
