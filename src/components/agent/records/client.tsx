"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import { columns } from "@/components/agent/records/columns"
import { Separator } from "@/components/ui/separator"
import DataTable from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"

// hooks
import { useDeletePayments } from "@/lib/hooks/payments/bulk-delete"
import { useGetPayments } from "@/lib/hooks/payments/get-all"
import { useSession } from "@/components/providers/session"
import { useMemo } from "react"

// utils
import { clientErrorHandler, formatPriceToPHP } from "@/lib/utils"
import toast from "react-hot-toast"

// types
import type { Row } from "@tanstack/react-table"
import type { Payment } from "@/lib/types"

const RecordsClient = () => {
  const { data: paymentsData } = useGetPayments()
  const deletePayments = useDeletePayments()
  const session = useSession()

  const handleDelete = async (rows: Row<Payment>[]) => {
    const ids = rows.map((r) => r.original.id)
    await toast.promise(deletePayments.mutateAsync({ ids }), {
      loading: <span className="animate-pulse">Deleting transactions...</span>,
      success: "Payments deleted",
      error: (error: unknown) => clientErrorHandler(error),
    })
  }

  const filteredPayments = useMemo(() => {
    const allPayments = paymentsData?.payments ?? []
    return allPayments.filter((payment) => payment.agent === session.name)
  }, [paymentsData?.payments, session.name])

  // Update calculations to use filtered payments
  const paymentsCount = filteredPayments.length
  const pendingPayments = filteredPayments.filter(
    (p) => p.status === "pending",
  ).length
  const totalEarnings = filteredPayments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  )

  return (
    <FallbackBoundary>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={"Records"} description="Manage recorded payments" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-3 shadow-sm">
            <div className="text-sm text-muted-foreground">Total Records</div>
            <div className="text-2xl font-bold text-green-600">
              {paymentsCount}
            </div>
          </div>

          <div className="rounded-lg border p-3 shadow-sm">
            <div className="text-sm text-muted-foreground">
              Pending Payments
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingPayments}
            </div>
          </div>

          <div className="rounded-lg border p-3 shadow-sm">
            <div className="text-sm text-muted-foreground">Total Earnings</div>
            <div className="text-2xl font-bold text-green-600">
              {formatPriceToPHP(totalEarnings.toString())}
            </div>
          </div>
        </div>

        <Separator />

        <DataTable
          placeholder="Search.."
          columns={columns}
          data={filteredPayments}
          isOnPayments
          onDelete={handleDelete}
        />
      </div>
    </FallbackBoundary>
  )
}

export default RecordsClient
