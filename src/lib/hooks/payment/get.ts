// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getPayment } from "@/lib/actions/payment/get"

// types
import type { Payment } from "@/lib/types"

export const useGetPayment = (id: string) => {
  return useSuspenseQuery<Payment, Error>({
    queryKey: ["payment", id],
    queryFn: () => getPayment(id),
  })
}
