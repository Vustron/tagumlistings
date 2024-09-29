"use client"

// components
import { ErrorFallback, LoadingFallback } from "@/components/shared/fallback"
import { columns } from "@/app/(admin)/_components/payments/columns"
import { Separator } from "@/components/ui/separator"
import DataTable from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"

// hooks
import { useDeletePayments } from "@/app/(admin)/_hooks/payment/bulk-delete"
import { useGetPayments } from "@/app/(admin)/_hooks/payment/get-all"
import { useFetchScroll } from "@/lib/hooks/use-fetch-scroll"
import { useRef } from "react"

// utils
import { ErrorBoundary } from "react-error-boundary"
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"
import { Suspense } from "react"

// types
import type { Payment } from "@/app/(admin)/_components/data/payments"
import type { Row } from "@tanstack/react-table"
import type { ElementRef } from "react"

const PaymentsClient = () => {
  const topRef = useRef<ElementRef<"div">>(null)
  const bottomRef = useRef<ElementRef<"div">>(null)
  const { data: paymentsData } = useGetPayments()
  const deletePayments = useDeletePayments()

  useFetchScroll({
    topRef,
    bottomRef,
  })

  const handleDelete = async (rows: Row<Payment>[]) => {
    const ids = rows.map((r) => r.original.id)
    await toast.promise(deletePayments.mutateAsync({ ids }), {
      loading: <span className="animate-pulse">Deleting payments...</span>,
      success: "Payments deleted",
      error: (error: unknown) => clientErrorHandler(error),
    })
    console.log(rows.map((row) => row.original.id))
  }

  const paymentsCount = paymentsData?.payments?.length || 0
  const payments = paymentsData?.payments ?? []

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Payments (${paymentsCount})`}
          description="Manage payment informations"
        />
      </div>
      <Separator className="mt-2" />
      <div ref={topRef}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingFallback />}>
            <DataTable
              placeholder="Search.."
              columns={columns}
              data={payments || []}
              isOnPayments
              onDelete={handleDelete}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div ref={bottomRef} />
    </>
  )
}

export default PaymentsClient
