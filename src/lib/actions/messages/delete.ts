// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { AddMessageValues } from "@/lib/validation"
import type { Message } from "@/lib/types"

export async function deleteMessage(id: string) {
  const URL = "messages/delete"
  const response = await httpRequest<AddMessageValues, Message>(URL, "DELETE", {
    params: {
      id,
    },
  })
  return response
}
