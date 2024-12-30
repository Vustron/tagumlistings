// configs
import { httpRequest } from "@/lib/config/http"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { QueryClient } from "@tanstack/react-query"
import type { Appointment } from "@/lib/types"

export async function getAppointment(id: string): Promise<Appointment> {
  const URL = "appointment/get"
  const response = await httpRequest<{ id: string }, Appointment>(URL, "GET", {
    params: {
      id,
    },
  })
  return response
}

export async function preFetchAppointment(id: string) {
  return async (_queryClient: QueryClient) => {
    return queryOptions<Appointment, Error>({
      enabled: !!id,
      queryKey: ["appointment", id],
      queryFn: () => getAppointment(id),
    })
  }
}
