"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import UpdatePaymentForm from "@/components/admin/record/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

// hooks
import { useQueryPaymentData } from "@/lib/hooks/payments/query-payment"

const RecordClient = ({ id }: { id: string }) => {
  const { accounts, appointments, properties, payment } =
    useQueryPaymentData(id)

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Update Record" description="Manage recorded payment" />
      </div>
      <Separator className="mt-2" />

      <div className="container flex flex-col justify-center items-center lg:w-[400px] sm:w-[300px] h-auto p-5 mt-5">
        <FallbackBoundary>
          <UpdatePaymentForm
            accounts={accounts}
            appointments={appointments}
            properties={properties}
            payment={payment}
          />
        </FallbackBoundary>
      </div>
    </>
  )
}

export default RecordClient
