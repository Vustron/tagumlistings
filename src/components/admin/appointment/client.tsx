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
  const { data: appointmentsDatesData } = useGetAppointmentDates()
  const { data: appointmentData } = useGetAppointment(id)
  const { data: accountsData } = useGetAccounts()

  const accounts = accountsData?.accounts ?? []
  const appointmentDates = appointmentsDatesData?.dates ?? []

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title="Appointment"
          description="Manage appointment information"
        />
      </div>
      <Separator className="mt-2" />

      <div className="container flex flex-col justify-center items-center lg:w-[400px] sm:w-[300px] h-auto p-5 mt-5">
        <FallbackBoundary>
          <UpdateAppointmentForm
            accounts={accounts}
            appointment={appointmentData}
            appointmentDates={appointmentDates}
          />
        </FallbackBoundary>
      </div>
    </>
  )
}

export default AppointmentClient
