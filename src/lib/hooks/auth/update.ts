"use client"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// actions
import { updateAccount } from "@/lib/actions/auth/update"
import { getSession } from "@/lib/actions/session/get"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { updateAccountSchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { UpdateAccountValues } from "@/lib/validation"
import type { QueryFilters } from "@tanstack/react-query"
import type { SessionData } from "@/lib/config/session"
import type { Accounts } from "@/lib/types"

const purify = DOMPurify

export const useUpdateAccount = (id?: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-account", id],
    mutationFn: async (values: UpdateAccountValues) => {
      const sanitizedData = sanitizer<UpdateAccountValues>(
        values,
        updateAccountSchema,
        purify,
      )
      return await updateAccount(sanitizedData)
    },
    onSuccess: async (updatedUser) => {
      const session = await getSession()

      const accountQueryFilter: QueryFilters = {
        queryKey: ["account", id],
      }

      if (id !== session.id) {
        const accountsQueryFilter: QueryFilters = {
          queryKey: ["accounts"],
        }
        await queryClient.cancelQueries(accountsQueryFilter)
        router.push("/admin/users")
        router.refresh()
      }

      await queryClient.cancelQueries(accountQueryFilter)
      queryClient.setQueryData<SessionData>(["account", id], (oldData) => ({
        ...oldData,
        ...updatedUser,
      }))

      if (id !== session.id) {
        queryClient.setQueryData<Accounts>(["accounts"], (oldData) => {
          if (!oldData) return { accounts: [updatedUser] }
          return {
            ...oldData,
            accounts: oldData.accounts.map((account) =>
              account.id === id ? updatedUser : account,
            ),
          }
        })
      }
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
