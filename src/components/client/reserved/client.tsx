"use client"

// components
import { columns } from "@/components/client/reserved/columns"
import { Separator } from "@/components/ui/separator"
import DataTable from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"

// hooks
// import { useRouter } from "next/navigation"

// types
import type { Row } from "@tanstack/react-table"
import type { Property } from "@/lib/types"

const ReservedPropertiesClient = () => {
  // init delete handler
  const handleDelete = async (rows: Row<Property>[]) => {
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
          title={"Reserved Properties (0)"}
          description="Manage reserved properties"
        />
      </div>
      <Separator className="mt-2" />
      <DataTable
        placeholder="Search..."
        columns={columns}
        isOnProperties
        data={[]}
        onDelete={handleDelete}
      />
    </>
  )
}

export default ReservedPropertiesClient
