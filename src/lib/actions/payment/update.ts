"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { UpdatePaymentValues } from "@/lib/validation"
import type { Payment } from "@/lib/types"

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
