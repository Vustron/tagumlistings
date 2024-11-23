"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import NewPaymentForm from "@/components/admin/new-payment/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

// hooks
import { useGetAppointments } from "@/lib/hooks/appointment/get-all"
import { useGetProperties } from "@/lib/hooks/property/get-all"
import { useGetAccounts } from "@/lib/hooks/auth/get-all"

interface AddPaymentClientProps {
  property?: string
}

const AddPaymentClient = ({ property }: AddPaymentClientProps) => {
  const { data: accountsData } = useGetAccounts()
  const { data: appointmentsData } = useGetAppointments()
  const { data: propertiesData } = useGetProperties()

  const accounts = accountsData?.accounts ?? []
  const appointments = appointmentsData?.appointments ?? []
  const properties = propertiesData?.properties ?? []

  return (
    <FallbackBoundary>
      <div className="flex items-start justify-between">
        <Heading title="Add Payment" description="Add new payment" />
      </div>
      <Separator className="mt-2" />

      <div className="container flex flex-col justify-center items-center lg:w-[400px] sm:w-[300px] h-auto p-5 mt-5">
        <NewPaymentForm
          accounts={accounts}
          appointments={appointments}
          properties={properties}
          property={property}
        />
      </div>
    </FallbackBoundary>
  )
}

export default AddPaymentClient
