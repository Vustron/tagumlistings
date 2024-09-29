// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getPayments } from "@/app/(admin)/_actions/payment/get-all"

// types
import type { Payments } from "@/app/(admin)/_components/data/payments"

export const useGetPayments = () => {
  return useSuspenseQuery<Payments, Error>({
    queryKey: ["payments"],
    queryFn: () => getPayments(),
  })
}
