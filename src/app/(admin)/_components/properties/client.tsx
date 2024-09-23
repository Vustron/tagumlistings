"use client"

// components
import { columns } from "@/app/(admin)/_components/properties/columns"
import { Separator } from "@/components/ui/separator"
import { Loader2, ServerCrash } from "lucide-react"
import DataTable from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"

// hooks
import { useDeleteProperties } from "@/app/(admin)/_hooks/property/bulk-delete"
import { useGetProperties } from "@/app/(admin)/_hooks/property/get-all"
import { useFetchScroll } from "@/lib/hooks/use-fetch-scroll"
import { useRef } from "react"

// utils
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"

// types
import type { Property } from "@/app/(admin)/_components/data/properties"
import type { Row } from "@tanstack/react-table"
import type { ElementRef } from "react"

const PropertiesClient = () => {
  const topRef = useRef<ElementRef<"div">>(null)
  const bottomRef = useRef<ElementRef<"div">>(null)
  const { data, status, isLoading } = useGetProperties()
  const deleteProperties = useDeleteProperties()

  useFetchScroll({
    topRef,
    bottomRef,
  })

  const handleDelete = async (rows: Row<Property>[]) => {
    const ids = rows.map((r) => r.original.id)
    await toast.promise(deleteProperties.mutateAsync({ ids }), {
      loading: <span className="animate-pulse">Deleting properties...</span>,
      success: "Properties deleted",
      error: (error: unknown) => clientErrorHandler(error),
    })
  }

  const propertyCount = data?.appointments?.length || 0
  const propertiesData = data?.appointments ?? []

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Properties (${propertyCount})`}
          description="Manage properties"
        />
      </div>
      <Separator className="mt-2" />
      {isLoading && (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center">
          <ServerCrash className="size-7 text-zinc-500 my-4" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Something went wrong!
          </p>
        </div>
      )}

      <div ref={topRef}>
        {status === "success" && propertiesData && (
          <DataTable
            filterKey="location"
            placeholder="tagum"
            columns={columns}
            isOnProperties
            data={propertiesData}
            onDelete={handleDelete}
          />
        )}
      </div>
      <div ref={bottomRef} />
    </>
  )
}

export default PropertiesClient
