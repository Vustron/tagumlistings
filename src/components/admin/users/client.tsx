"use client"

// components
import { ErrorFallback, LoadingFallback } from "@/components/shared/fallback"
import { columns } from "@/components/admin/users/columns"
import { Separator } from "@/components/ui/separator"
import DataTable from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"

// hooks
import { useFetchScroll } from "@/lib/hooks/utils/use-fetch-scroll"
import { useDeleteAccounts } from "@/lib/hooks/auth/bulk-delete"
import { useGetAccounts } from "@/lib/hooks/auth/get-all"
import { useRef } from "react"

// utils
// utils
import { ErrorBoundary } from "react-error-boundary"
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"
import { Suspense } from "react"

// types
import type { Row } from "@tanstack/react-table"
import type { UserData } from "@/lib/types"
import type { ElementRef } from "react"

const UsersClient = () => {
  const topRef = useRef<ElementRef<"div">>(null)
  const bottomRef = useRef<ElementRef<"div">>(null)
  const { data } = useGetAccounts()
  const deleteAccounts = useDeleteAccounts()

  useFetchScroll({
    topRef,
    bottomRef,
  })

  const handleDelete = async (rows: Row<UserData>[]) => {
    const ids = rows.map((r) => r.original.id)

    await toast.promise(deleteAccounts.mutateAsync({ ids }), {
      loading: <span className="animate-pulse">Deleting accounts...</span>,
      success: "Accounts deleted",
      error: (error: unknown) => clientErrorHandler(error),
    })
  }

  const accountCount = data?.accounts?.length || 0
  const accountsData = data?.accounts ?? []

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Users (${accountCount})`} description="Manage users" />
      </div>
      <Separator className="mt-2" />

      <div ref={topRef}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingFallback />}>
            <DataTable
              placeholder="Search.."
              columns={columns}
              isOnUsers
              data={accountsData}
              onDelete={handleDelete}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div ref={bottomRef} />
    </>
  )
}

export default UsersClient
