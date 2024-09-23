"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { AppointmentDate } from "@/app/(admin)/_components/appointments/date"
import type { AddAppointmentDateValues } from "@/lib/validation"

export async function saveAppointmentDate(data: AppointmentDate) {
  const URL = "appointment/save-date"
  const response = await httpRequest<AddAppointmentDateValues, AppointmentDate>(
    URL,
    "POST",
    {
      body: data,
    },
  )
  return response
}
