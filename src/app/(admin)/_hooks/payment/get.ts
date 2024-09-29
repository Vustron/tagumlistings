// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getPayment } from "@/app/(admin)/_actions/payment/get"

// types
import type { Payment } from "@/app/(admin)/_components/data/payments"

export const useGetPayment = (id: string) => {
  return useSuspenseQuery<Payment, Error>({
    queryKey: ["payment", id],
    queryFn: () => getPayment(id),
  })
}
