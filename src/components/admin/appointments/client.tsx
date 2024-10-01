"use client"

// components
import { ErrorFallback, LoadingFallback } from "@/components/shared/fallback"
import AppointmentCalendar from "@/components/admin/appointments/calendar"

// hooks
import { useGetAppointmentDates } from "@/lib/hooks/appointment/get-dates"
import { useGetAppointments } from "@/lib/hooks/appointment/get-all"

// utils
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"

const AppointmentsClient = () => {
  const { data: appointmentsData } = useGetAppointments()
  const { data: datesData } = useGetAppointmentDates()

  return (
    <div className="mt-6 mb-2">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingFallback />}>
          <AppointmentCalendar
            events={appointmentsData.appointments}
            appointmentDates={datesData.dates}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default AppointmentsClient
