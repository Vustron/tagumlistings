"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { AppointmentDate } from "@/app/(admin)/_components/appointments/date"

export interface AppointmentDates {
  dates: AppointmentDate[]
}

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
