"use client"

// components
import { columns } from "@/app/(client)/_components/payments/columns"
import DataTable from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

// hooks
// import { useRouter } from "next/navigation"

// types
import type { Payments } from "@/app/(client)/_components/data/payments"
import type { Row } from "@tanstack/react-table"

interface PaymentsClientProps {
  data: Payments[]
}

const PaymentsClient = ({ data }: PaymentsClientProps) => {
  // init delete handler
  const handleDelete = async (rows: Row<Payments>[]) => {
    // const ids = rows.map((r) => r.original.id)
    // await toast.promise(deleteAccounts.mutateAsync({ ids }), {
    //   loading: <span className="animate-pulse">Deleting users...</span>,
    //   success: "Users deleted",
    //   error: (error: unknown) => clientErrorHandler(error),
    // })
    console.log(rows.map((row) => row.original.id))
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Payments (${data.length})`}
          description="Manage payments"
        />
      </div>
      <Separator className="mt-2" />
      <DataTable
        placeholder="Search..."
        columns={columns}
        data={data || []}
        isOnPayments
        onDelete={handleDelete}
      />
    </>
  )
}

export default PaymentsClient
