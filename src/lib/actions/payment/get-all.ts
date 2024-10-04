// configs
import { httpRequest } from "@/lib/config/http"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { Payments } from "@/lib/types"

export async function getPayments(): Promise<Payments> {
  const URL = "payment/get-all"
  const response = await httpRequest<void, Payments>(URL, "GET")
  return response
}

export async function preFetchPayments() {
  return queryOptions<Payments, Error>({
    queryKey: ["payments"],
    queryFn: () => getPayments(),
  })
}
