"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import UpdatePaymentForm from "@/components/admin/record/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

// hooks
import { useGetAppointments } from "@/lib/hooks/appointment/get-all"
import { useGetProperties } from "@/lib/hooks/property/get-all"
import { useGetAccounts } from "@/lib/hooks/auth/get-all"
import { useGetPayment } from "@/lib/hooks/payments/get"

const RecordClient = ({ id }: { id: string }) => {
  const { data: accounts } = useGetAccounts()
  const { data: appointments } = useGetAppointments()
  const { data: properties } = useGetProperties()
  const { data: payment } = useGetPayment(id)

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Update Record" description="Manage recorded payment" />
      </div>
      <Separator className="mt-2" />

      <div className="container flex flex-col justify-center items-center lg:w-[400px] sm:w-[300px] h-auto p-5 mt-5">
        <FallbackBoundary>
          <UpdatePaymentForm
            accounts={accounts.accounts}
            appointments={appointments.appointments}
            properties={properties.properties}
            payment={payment}
          />
        </FallbackBoundary>
      </div>
    </>
  )
}

export default RecordClient
