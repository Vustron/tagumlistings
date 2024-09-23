"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { Appointment } from "@/app/(admin)/_components/appointments/new"
import type { AddAppointmentValues } from "@/lib/validation"

export async function createAppointment(data: AddAppointmentValues) {
  const URL = "appointment/create"
  const response = await httpRequest<AddAppointmentValues, Appointment>(
    URL,
    "POST",
    {
      body: data,
    },
  )
  return response
}
