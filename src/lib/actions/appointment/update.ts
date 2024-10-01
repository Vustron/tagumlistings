"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { UpdateAppointmentValues } from "@/lib/validation"
import type { Appointment } from "@/lib/types"

export async function updateAppointment(
  appointmentData: UpdateAppointmentValues,
) {
  const URL = "appointments/update"
  const response = await httpRequest<UpdateAppointmentValues, Appointment>(
    URL,
    "PATCH",
    {
      body: appointmentData,
    },
  )
  return response
}
