"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { AppointmentDates } from "@/lib/types"

export async function getAppointmentDates(): Promise<AppointmentDates> {
  const URL = "appointment/get-dates"
  const response = await httpRequest<void, AppointmentDates>(URL, "GET")
  return response
}

export async function preFetchAppointmentDates() {
  return queryOptions<AppointmentDates, Error>({
    queryKey: ["appointment-dates"],
    queryFn: () => getAppointmentDates(),
  })
}
