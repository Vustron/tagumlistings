"use client"

// components
// import { columns } from "@/components/client/payments/columns"
// import { Separator } from "@/components/ui/separator"
// import DataTable from "@/components/ui/data-table"
// import { Heading } from "@/components/ui/heading"

// hooks
// import { useRouter } from "next/navigation"

// types
// import type { Row } from "@tanstack/react-table"
// import type { Payment } from "@/lib/types"

const PaymentsClient = () => {
  // init delete handler
  // const handleDelete = async (rows: Row<Payment>[]) => {
  // const ids = rows.map((r) => r.original.id)
  // await toast.promise(deleteAccounts.mutateAsync({ ids }), {
  //   loading: <span className="animate-pulse">Deleting users...</span>,
  //   success: "Users deleted",
  //   error: (error: unknown) => clientErrorHandler(error),
  // })
  //   console.log(rows.map((row) => row.original.id))
  // }

  return (
    <>
      {/* <div className="flex items-start justify-between">
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
      /> */}
    </>
  )
}

export default PaymentsClient
