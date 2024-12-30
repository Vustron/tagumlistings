"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import { Separator } from "@/components/ui/separator"
import DataTable from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"

// hooks
import { useGetAppointmentDates } from "@/lib/hooks/appointment/get-dates"
import { useGetAppointments } from "@/lib/hooks/appointment/get-all"
import { useSession } from "@/components/providers/session"
import { useMemo } from "react"

// utils
import { columns } from "@/components/client/appointments/columns"

// types
import type { Appointment } from "@/lib/types"

const AppointmentsClient = () => {
  const { data: appointmentsData } = useGetAppointments()
  const { data: appointmentDates } = useGetAppointmentDates()
  const session = useSession()

  const filteredAppointments = useMemo(() => {
    return appointmentsData.appointments.filter((appointment: Appointment) => {
      return appointment.user === session.name
    })
  }, [appointmentsData, session.name])

  const appointmentsCount = filteredAppointments.length
  const dates = appointmentDates?.dates

  return (
    <FallbackBoundary>
      <div className="container p-10">
        <div className="flex items-start justify-between">
          <Heading
            title={`Appointments (${appointmentsCount})`}
            description=""
          />
        </div>
        <Separator className="mt-2" />

        <DataTable
          placeholder="Search.."
          columns={columns}
          data={filteredAppointments}
          appointment={filteredAppointments}
          appointmentDates={dates}
          isOnClientAppointments
        />
      </div>
    </FallbackBoundary>
  )
}

export default AppointmentsClient
