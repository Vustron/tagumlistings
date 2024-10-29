// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { AddMessageValues } from "@/lib/validation"
import type { Message } from "@/lib/types"

export async function updateMessage(data: AddMessageValues) {
  const URL = "messages/update"
  const response = await httpRequest<AddMessageValues, Message>(URL, "PATCH", {
    body: data,
  })
  return response
}
