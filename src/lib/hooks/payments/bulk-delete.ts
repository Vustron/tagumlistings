"use client"

// actions
import { deletePayments } from "@/lib/actions/payment/bulk-delete"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import DOMPurify from "dompurify"

// validation
import { bulkDeletePaymentsSchema } from "@/lib/validation"

// types
import type { BulkDeletePaymentsValues } from "@/lib/validation"
import type { QueryFilters } from "@tanstack/react-query"
import type { Payments } from "@/lib/types"

const purify = DOMPurify

export const useDeletePayments = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["bulk-delete-payments"],
    mutationFn: async (ids: BulkDeletePaymentsValues) => {
      const sanitizedData = sanitizer<BulkDeletePaymentsValues>(
        ids,
        bulkDeletePaymentsSchema,
        purify,
      )

      const filteredIds = (sanitizedData.ids || []).filter(
        (id): id is string => id !== undefined,
      )

      const bodyData = {
        ids: filteredIds,
      }

      return await deletePayments(bodyData)
    },
    onSuccess: async (_, variables) => {
      const queryFilter: QueryFilters = {
        queryKey: ["payments"],
      }

      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<Payments>(["payments"], (oldData) => {
        if (!oldData) return undefined

        const deletedIds = new Set(variables.ids)

        return {
          ...oldData,
          payments: oldData.payments.filter(
            (payment) => !deletedIds.has(payment.id),
          ),
        }
      })
    },

    onSettled: () => {
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
