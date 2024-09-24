"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { Appointment } from "@/app/(admin)/_components/appointments/new"

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
  return queryOptions<Appointment, Error>({
    enabled: !!id,
    queryKey: ["appointment", id],
    queryFn: () => getAppointment(id),
  })
}
