"use client"

// actions
import { deleteAccounts } from "@/lib/actions/auth/bulk-delete"
import { getSession } from "@/lib/actions/session/get"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import DOMPurify from "dompurify"

// validation
import { bulkDeleteAccountsSchema } from "@/lib/validation"

// types
import type { BulkDeleteAccountValues } from "@/lib/validation"
import type { QueryFilters } from "@tanstack/react-query"
import type { Accounts, UserData } from "@/lib/types"

const purify = DOMPurify

export const useDeleteAccounts = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["bulk-delete-accounts"],
    mutationFn: async (ids: BulkDeleteAccountValues) => {
      const sanitizedData = sanitizer<BulkDeleteAccountValues>(
        ids,
        bulkDeleteAccountsSchema,
        purify,
      )

      const filteredIds = (sanitizedData.ids || []).filter(
        (id): id is string => id !== undefined,
      )

      const bodyData = {
        ids: filteredIds,
      }

      return await deleteAccounts(bodyData)
    },

    onSuccess: async (remainingUsers: UserData[]) => {
      const session = await getSession()

      const queryFilter: QueryFilters = {
        queryKey: ["accounts"],
      }
      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<Accounts | undefined>(
        ["accounts"],
        (oldData) => {
          if (!oldData) return undefined

          const updatedAccounts = remainingUsers.filter(
            (user) => user.id !== session?.id,
          )

          const currentUser = oldData.accounts.find(
            (user) => user.id === session?.id,
          )
          if (
            currentUser &&
            !updatedAccounts.some((user) => user.id === currentUser.id)
          ) {
            updatedAccounts.push(currentUser as UserData)
          }

          return {
            ...oldData,
            accounts: updatedAccounts,
          }
        },
      )
    },

    onSettled: () => {
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
