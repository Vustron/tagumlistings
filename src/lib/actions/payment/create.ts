// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { AddPaymentValues } from "@/lib/validation"
import type { Payment } from "@/lib/types"

export async function createPayment(data: AddPaymentValues) {
  const URL = "payment/create"
  const response = await httpRequest<AddPaymentValues, Payment>(URL, "POST", {
    body: data,
  })
  return response
}
