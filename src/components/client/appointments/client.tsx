"use client"

// components
import AppointmentCalendar from "@/components/admin/appointments/calendar"

const AppointmentsClient = () => {
  return (
    <div className="mt-6 mb-2">
      <AppointmentCalendar events={[]} appointmentDates={[]} />
    </div>
  )
}

export default AppointmentsClient
