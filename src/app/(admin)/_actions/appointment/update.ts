"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { Appointment } from "@/app/(admin)/_components/appointments/new"
import type { UpdateAppointmentValues } from "@/lib/validation"

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
