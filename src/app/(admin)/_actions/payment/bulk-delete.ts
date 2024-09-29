"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { Payment } from "@/app/(admin)/_components/data/payments"

export interface DeletePaymentsProps {
  ids: string[]
}

export async function deletePayments(
  ids: DeletePaymentsProps,
): Promise<Payment[]> {
  const URL = "payment/bulk-delete"
  const response = await httpRequest<DeletePaymentsProps, Payment[]>(
    URL,
    "POST",
    {
      body: ids,
    },
  )
  return response
}
