"use client"

// components
import { columns } from "@/app/(admin)/properties/_components/columns"
import DataTable from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

// hooks
import { useRouter } from "next/navigation"

// types
import type { Property } from "@/app/(admin)/properties/constants"
import type { Row } from "@tanstack/react-table"

interface UsersClientProps {
  data: Property[]
}

const UsersClient = ({ data }: UsersClientProps) => {
  // init delete handler
  const handleDelete = async (rows: Row<Property>[]) => {
    // const ids = rows.map((r) => r.original.id)
    // await toast.promise(deleteAccounts.mutateAsync({ ids }), {
    //   loading: <span className="animate-pulse">Deleting users...</span>,
    //   success: "Users deleted",
    //   error: (error: unknown) => clientErrorHandler(error),
    // })
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Properties (${data.length})`}
          description="Manage properties"
        />
      </div>
      <Separator className="mt-2" />
      <DataTable
        filterKey="location"
        placeholder="123, Anytown"
        columns={columns}
        isOnProperties
        data={data || []}
        onDelete={handleDelete}
      />
    </>
  )
}

export default UsersClient
