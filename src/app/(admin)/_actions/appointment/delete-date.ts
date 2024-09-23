"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { Appointment } from "@/app/(admin)/_components/appointments/new"

export async function deleteAppointmentsDate(
  id: string,
): Promise<Appointment[]> {
  const URL = "appointments/delete-date"
  const response = await httpRequest<void, Appointment[]>(URL, "DELETE", {
    params: {
      id,
    },
  })
  return response
}
