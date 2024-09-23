"use client"

// components
import UpdatePropertyForm from "@/app/(admin)/_components/property/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { Loader2 } from "lucide-react"

// hooks
import { useGetProperty } from "@/app/(admin)/_hooks/property/get"

// utils
// import { clientErrorHandler } from "@/lib/utils"
// import toast from "react-hot-toast"

// types
// import type { Property } from "@/app/(admin)/_components/data/properties"
// import type { Row } from "@tanstack/react-table"

// import type { ElementRef } from "react"

const PropertyClient = ({ id }: { id?: string }) => {
  const { data, status, error, isLoading } = useGetProperty(id!)

  //const handleDelete = async (rows: Row<Property>[]) => {
  // const ids = rows.map((r) => r.original.id)
  // await toast.promise(deleteAccounts.mutateAsync({ ids }), {
  //   loading: <span className="animate-pulse">Deleting users...</span>,
  //   success: "Users deleted",
  //   error: (error: unknown) => clientErrorHandler(error),
  // })
  // }

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Property" description="Manage property information" />
      </div>
      <Separator className="mt-2" />

      <div className="container flex flex-col justify-center items-center lg:w-[400px] sm:w-[300px] h-auto p-5 mt-5">
        {isLoading ? (
          <Loader2 className="animate-spin size-6" />
        ) : status === "error" ? (
          <span className="absolute inset-0 flex items-center justify-center">
            {error?.message}
          </span>
        ) : (
          status === "success" && data && <UpdatePropertyForm data={data} />
        )}
      </div>
    </>
  )
}

export default PropertyClient
