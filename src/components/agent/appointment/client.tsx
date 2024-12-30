"use client"

// components
import UpdateAppointmentForm from "@/components/admin/appointment/form"
import FallbackBoundary from "@/components/shared/fallback-boundary"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

// hooks
import { useGetAppointmentDates } from "@/lib/hooks/appointment/get-dates"
import { useGetAppointment } from "@/lib/hooks/appointment/get"
import { useGetAccounts } from "@/lib/hooks/auth/get-all"

const AppointmentClient = ({ id }: { id: string }) => {
  const { data: accounts } = useGetAccounts()
  const { data: appointment } = useGetAppointment(id)
  const { data: appointmentDates } = useGetAppointmentDates()
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
          accounts={accounts.accounts}
          appointment={appointment}
          appointmentDates={appointmentDates.dates}
        />
      </div>
    </FallbackBoundary>
  )
}

export default AppointmentClient
