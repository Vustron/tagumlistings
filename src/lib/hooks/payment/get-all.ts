"use client"

// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getPayments } from "@/lib/actions/payment/get-all"

// types
import type { Payments } from "@/lib/types"

export const useGetPayments = () => {
  return useSuspenseQuery<Payments, Error>({
    queryKey: ["payments"],
    queryFn: () => getPayments(),
  })
}
