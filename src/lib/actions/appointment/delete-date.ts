"use server"

// configs
import { httpRequest } from "@/lib/config/http"

export async function deleteAppointmentDate(id: string): Promise<string> {
  const URL = "appointments/delete-date"
  const response = await httpRequest<void, string>(URL, "DELETE", {
    params: {
      id,
    },
  })
  return response
}
