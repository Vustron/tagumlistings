"use client"

// components
import UpdateAppointmentForm from "@/app/(admin)/_components/appointment/form"
import { ErrorFallback, LoadingFallback } from "@/components/shared/fallback"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

// hooks
import { useGetAppointmentDates } from "@/app/(admin)/_hooks/appointment/get-dates"
import { useGetAppointment } from "@/app/(admin)/_hooks/appointment/get"
import { useGetAccounts } from "@/app/(auth)/_hooks/auth/get-all"

// utils
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"

const AppointmentClient = ({ id }: { id: string }) => {
  const { data: accountsData } = useGetAccounts()
  const { data: appointmentsDatesData } = useGetAppointmentDates()
  const { data: appointmentData } = useGetAppointment(id)

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
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingFallback />}>
            <UpdateAppointmentForm
              accounts={accounts}
              appointment={appointmentData}
              appointmentDates={appointmentDates}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  )
}

export default AppointmentClient
