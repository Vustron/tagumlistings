"use client"

// components
import UpdateAppointmentForm from "@/components/admin/appointment/form"
import FallbackBoundary from "@/components/shared/fallback-boundary"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

// hooks
import { useQueryAppointment } from "@/lib/hooks/appointment/query-appointment"

const AppointmentClient = ({ id }: { id: string }) => {
  const { accounts, appointment, appointmentDates } = useQueryAppointment(id)

  return (
    <FallbackBoundary>
      <div className="flex items-start justify-between">
        <Heading
          title="Appointment"
          description="Manage appointment information"
        />
      </div>
      <Separator className="mt-2" />

      <div className="container flex flex-col justify-center items-center lg:w-[400px] sm:w-[300px] h-auto p-5 mt-5">
        <UpdateAppointmentForm
          accounts={accounts}
          appointment={appointment}
          appointmentDates={appointmentDates}
        />
      </div>
    </FallbackBoundary>
  )
}

export default AppointmentClient
