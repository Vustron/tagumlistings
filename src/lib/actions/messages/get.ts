// configs
import { httpRequest } from "@/lib/config/http"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { Message } from "@/lib/types"

export async function getMessage(id: string): Promise<Message> {
  const URL = "messages/get"
  const response = await httpRequest<{ id: string }, Message>(URL, "GET", {
    params: {
      id,
    },
  })
  return response
}

export async function preFetchAppointment(id: string) {
  return queryOptions<Message, Error>({
    enabled: !!id,
    queryKey: [ "message", id ],
    queryFn: () => getMessage(id),
  })
}
