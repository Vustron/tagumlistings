"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import ReportsChart from "@/components/agent/reports/reports-chart"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

// hooks
import { useQueryReportData } from "@/lib/hooks/report/query-report"

const ReportsClient = () => {
  const { payments, appointments, totalReports } = useQueryReportData()

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
