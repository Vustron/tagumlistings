"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { Appointments } from "@/lib/types"

export async function getAppointments(): Promise<Appointments> {
  const URL = "appointment/get-all"
  const response = await httpRequest<void, Appointments>(URL, "GET")
  return response
}

export async function preFetchAppointments() {
  return queryOptions<Appointments, Error>({
    queryKey: ["appointments"],
    queryFn: () => getAppointments(),
  })
}
