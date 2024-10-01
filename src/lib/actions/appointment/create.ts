"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { AddAppointmentValues } from "@/lib/validation"
import type { Appointment } from "@/lib/types"

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
