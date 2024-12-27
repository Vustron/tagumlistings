"use client"

// action
import { deletePayment } from "@/lib/actions/payment/delete"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/components/providers/session"
import { useRouter } from "next-nprogress-bar"

// utils
import { clientErrorHandler } from "@/lib/utils"

// types
import type { QueryFilters } from "@tanstack/react-query"
import type { Payments } from "@/lib/types"

export const useDeletePayment = (id: string | undefined) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const session = useSession()

  return useMutation({
    mutationKey: ["delete-payment", id],
    mutationFn: async () => await deletePayment(id!),
    onSuccess: async (deletedId: string) => {
      const queryFilter: QueryFilters = {
        queryKey: ["payments"],
      }

      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<Payments>(["payments"], (oldData) => {
        if (!oldData) return undefined

        return {
          ...oldData,
          payments: oldData.payments.filter(
            (payment) => payment.id !== deletedId,
          ),
        }
      })
    },
    onSettled: async () => {
      if (session.role === "agent") {
        router.push("/agent/records")
        router.refresh()
      }
      router.push("/admin/records")
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
