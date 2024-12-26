"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import { Separator } from "@/components/ui/separator"
import DataTable from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"

// hooks
import { useQueryAppointments } from "@/lib/hooks/appointment/query-appointments"
import { useFetchScroll } from "@/lib/hooks/utils/use-fetch-scroll"
import { useSession } from "@/components/providers/session"
import { useRef, useMemo } from "react"

// utils
import { columns } from "@/components/client/appointments/columns"

// types
import type { Appointment } from "@/lib/types"

const AppointmentsClient = () => {
  const { appointments, appointmentDates } = useQueryAppointments()
  const session = useSession()

  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  useFetchScroll({
    topRef,
    bottomRef,
  })

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment: Appointment) => {
      return appointment.user === session.name
    })
  }, [appointments, session.name])

  const appointmentsCount = filteredAppointments.length
  const dates = appointmentDates ?? []

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

        <div ref={topRef}>
          <DataTable
            placeholder="Search.."
            columns={columns}
            data={filteredAppointments}
            appointment={filteredAppointments}
            appointmentDates={dates}
            isOnClientAppointments
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </FallbackBoundary>
  )
}

export default AppointmentsClient
