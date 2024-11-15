"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import ReportsChart from "@/components/admin/reports/reports-chart"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

// hooks
import { useGetAppointments } from "@/lib/hooks/appointment/get-all"
import { useGetPayments } from "@/lib/hooks/payment/get-all"

const ReportsClient = () => {
  const { data: paymentsData } = useGetPayments()
  const paymentsCount = paymentsData?.payments?.length || 0
  const payments = paymentsData?.payments ?? []

  const { data: appointmentsData } = useGetAppointments()
  const appointmentsCount = appointmentsData?.appointments?.length || 0
  const appointments = appointmentsData?.appointments ?? []
  const totalReports = paymentsCount + appointmentsCount

  return (
    <FallbackBoundary>
      <div className="flex items-start justify-between">
        <Heading
          title={`Reports (${totalReports})`}
          description="Manage reports on properties"
        />
      </div>
      <Separator className="mt-2" />

      <div className="w-full max-w-5xl mx-auto mt-8">
        <ReportsChart payments={payments} appointments={appointments} />
      </div>
    </FallbackBoundary>
  )
}

export default ReportsClient
