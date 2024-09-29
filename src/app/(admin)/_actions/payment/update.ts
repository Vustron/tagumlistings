"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { Payment } from "@/app/(admin)/_components/data/payments"
import type { UpdatePaymentValues } from "@/lib/validation"

export async function updatePayment(data: UpdatePaymentValues) {
  const URL = "payment/update"
  const response = await httpRequest<UpdatePaymentValues, Payment>(
    URL,
    "PATCH",
    {
      body: data,
    },
  )
  return response
}
