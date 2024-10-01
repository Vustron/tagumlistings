"use client"

// components
import { ErrorFallback, LoadingFallback } from "@/components/shared/fallback"
import UpdatePropertyForm from "@/components/admin/property/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

// hooks
import { useGetProperty } from "@/lib/hooks/property/get"

// utils
import { ErrorBoundary } from "react-error-boundary"
// import { clientErrorHandler } from "@/lib/utils"
// import toast from "react-hot-toast"
import { Suspense } from "react"

// types
// import type { Property } from "@/app/(admin)/_components/data/properties"
// import type { Row } from "@tanstack/react-table"

// import type { ElementRef } from "react"

const PropertyClient = ({ id }: { id?: string }) => {
  const { data } = useGetProperty(id!)

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
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingFallback />}>
            <UpdatePropertyForm data={data} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  )
}

export default PropertyClient
