"use client"

// components
import { columns } from "@/app/(admin)/_components/users/columns"
import DataTable from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Loader2, ServerCrash } from "lucide-react"

// hooks
import { useFetchScroll } from "@/lib/hooks/use-fetch-scroll"
import { useGetAccounts } from "@/app/(auth)/_hooks/use-get-accounts"
import { useRef } from "react"

// types
import type { ElementRef } from "react"

const UsersClient = () => {
  const topRef = useRef<ElementRef<"div">>(null)
  const bottomRef = useRef<ElementRef<"div">>(null)
  const { data, status, isLoading } = useGetAccounts()

  useFetchScroll({
    topRef,
    bottomRef,
  })

  const handleDelete = async () => {
    // const ids = rows.map((r) => r.original.id)
    // await toast.promise(deleteAccounts.mutateAsync({ ids }), {
    //   loading: <span className="animate-pulse">Deleting users...</span>,
    //   success: "Users deleted",
    //   error: (error: unknown) => clientErrorHandler(error),
    // })
  }

  const accountCount = data?.accounts?.length || 0
  const accountsData = data?.accounts ?? []

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Users (${accountCount})`} description="Manage users" />
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
        {status === "success" && data && (
          <DataTable
            filterKey="name"
            placeholder="John Doe"
            columns={columns}
            isOnUsers
            data={accountsData}
            onDelete={handleDelete}
          />
        )}
      </div>
      <div ref={bottomRef} />
    </>
  )
}

export default UsersClient
