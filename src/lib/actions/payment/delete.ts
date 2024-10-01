"use server"

// configs
import { httpRequest } from "@/lib/config/http"

export async function deletePayment(id: string): Promise<string> {
  const URL = "payment/delete"
  const response = await httpRequest<void, string>(URL, "DELETE", {
    params: {
      id,
    },
  })
  return response
}
