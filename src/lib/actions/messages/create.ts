// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { AddMessageValues } from "@/lib/validation"
import type { Message } from "@/lib/types"

export async function createMessage(data: AddMessageValues) {
  const URL = "messages/create"
  const response = await httpRequest<AddMessageValues, Message>(URL, "POST", {
    body: data,
  })
  return response
}
