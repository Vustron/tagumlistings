"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { Payment } from "@/app/(admin)/_components/data/payments"
import type { AddPaymentValues } from "@/lib/validation"

export async function createPayment(data: AddPaymentValues) {
  const URL = "payment/create"
  const response = await httpRequest<AddPaymentValues, Payment>(URL, "POST", {
    body: data,
  })
  return response
}
