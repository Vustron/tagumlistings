"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import UpdatePaymentForm from "@/components/admin/payment/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

// hooks
import { useGetAppointments } from "@/lib/hooks/appointment/get-all"
import { useGetProperties } from "@/lib/hooks/property/get-all"
import { useGetAccounts } from "@/lib/hooks/auth/get-all"
import { useGetPayment } from "@/lib/hooks/payment/get"

const PaymentClient = ({ id }: { id: string }) => {
  const { data: accountsData } = useGetAccounts()
  const { data: appointmentsData } = useGetAppointments()
  const { data: propertiesData } = useGetProperties()
  const { data: paymentData } = useGetPayment(id)

  const accounts = accountsData?.accounts ?? []
  const appointments = appointmentsData?.appointments ?? []
  const properties = propertiesData?.properties ?? []

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Update Transaction" description="Manage transaction" />
      </div>
      <Separator className="mt-2" />

      <div className="container flex flex-col justify-center items-center lg:w-[400px] sm:w-[300px] h-auto p-5 mt-5">
        <FallbackBoundary>
          <UpdatePaymentForm
            accounts={accounts}
            appointments={appointments}
            properties={properties}
            payment={paymentData}
          />
        </FallbackBoundary>
      </div>
    </>
  )
}

export default PaymentClient
