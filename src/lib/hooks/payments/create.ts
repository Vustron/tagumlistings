"use client"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/components/providers/session"
import { useRouter } from "next-nprogress-bar"

// actions
import { createPayment } from "@/lib/actions/payment/create"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { addPaymentSchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { QueryFilters } from "@tanstack/react-query"
import type { AddPaymentValues } from "@/lib/validation"
import type { Payments } from "@/lib/types"

const purify = DOMPurify

export const useCreatePayment = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const session = useSession()

  return useMutation({
    mutationKey: ["create-payment"],
    mutationFn: async (values: AddPaymentValues) => {
      const sanitizedData = sanitizer<AddPaymentValues>(
        values,
        addPaymentSchema,
        purify,
      )
      return await createPayment(sanitizedData)
    },
    onSuccess: async (newPayment) => {
      const queryFilter: QueryFilters = {
        queryKey: ["payments"],
      }

      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<Payments>(["payments"], (oldData) => {
        if (!oldData) {
          return { payments: [newPayment] }
        }
        return {
          ...oldData,
          payments: [...oldData.payments, newPayment],
        }
      })
    },
    onSettled: () => {
      if (session.role === "agent") {
        router.push("/agent/properties")
        router.refresh()
      }
      router.push("/admin/properties")
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
