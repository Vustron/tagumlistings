"use client"

// components
import FallbackBoundary from "@/components/shared/fallback-boundary"
import { columns } from "@/components/admin/users/columns"
import { Separator } from "@/components/ui/separator"
import DataTable from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"

// hooks
import { useDeleteAccounts } from "@/lib/hooks/auth/bulk-delete"
import { useGetAccounts } from "@/lib/hooks/auth/get-all"

// utils
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"

// types
import type { Row } from "@tanstack/react-table"
import type { UserData } from "@/lib/types"

const UsersClient = () => {
  const { data } = useGetAccounts()
  const deleteAccounts = useDeleteAccounts()

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
    <FallbackBoundary>
      <div className="flex items-start justify-between">
        <Heading title={`Users (${accountCount})`} description="Manage users" />
      </div>
      <Separator className="mt-2" />

      <DataTable
        placeholder="Search.."
        columns={columns}
        isOnUsers
        data={accountsData}
        onDelete={handleDelete}
      />
    </FallbackBoundary>
  )
}

export default UsersClient
