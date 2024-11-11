"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import { columns } from "@/components/client/payments/columns"
import { Separator } from "@/components/ui/separator"
import DataTable from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"

// hooks
import { useDeletePayments } from "@/lib/hooks/payment/bulk-delete"
import { useFetchScroll } from "@/lib/hooks/utils/use-fetch-scroll"
import { useGetPayments } from "@/lib/hooks/payment/get-all"
import { useSession } from "@/components/providers/session"
import { useRef, useMemo } from "react"

// utils
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"

// types
import type { Row } from "@tanstack/react-table"
import type { Payment } from "@/lib/types"
import type { ElementRef } from "react"

const PaymentsClient = () => {
  const topRef = useRef<ElementRef<"div">>(null)
  const bottomRef = useRef<ElementRef<"div">>(null)
  const { data: paymentsData } = useGetPayments()
  const deletePayments = useDeletePayments()
  const session = useSession()

  useFetchScroll({
    topRef,
    bottomRef,
  })

  // Filter payments based on session.id
  const filteredPayments = useMemo(() => {
    if (!paymentsData?.payments || !session?.id) return []

    return paymentsData.payments.filter((payment) => {
      // For admin users, show all payments
      if (session.role === "admin") return true

      // For regular users, only show their own payments
      return payment.user === session.name
    })
  }, [paymentsData?.payments, session?.name, session?.role])

  const handleDelete = async (rows: Row<Payment>[]) => {
    const ids = rows.map((r) => r.original.id)
    await toast.promise(deletePayments.mutateAsync({ ids }), {
      loading: <span className="animate-pulse">Deleting payments...</span>,
      success: "Payments deleted",
      error: (error: unknown) => clientErrorHandler(error),
    })
  }

  const paymentsCount = filteredPayments.length

  return (
    <FallbackBoundary>
      <div className="flex items-start justify-between">
        <Heading
          title={`Payments (${paymentsCount})`}
          description={
            session?.role === "admin"
              ? "Manage payment information"
              : "View your payment information"
          }
        />
      </div>
      <Separator className="mt-2" />
      <div ref={topRef}>
        <DataTable
          placeholder="Search.."
          columns={columns}
          data={filteredPayments}
          isOnPayments
          onDelete={session?.role === "admin" ? handleDelete : undefined}
          isOnClient
        />
      </div>
      <div ref={bottomRef} />
    </FallbackBoundary>
  )
}

export default PaymentsClient
