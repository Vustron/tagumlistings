// configs
import { httpRequest } from "@/lib/config/http"

export async function deleteAppointment(id: string): Promise<string> {
  const URL = "appointments/delete"
  const response = await httpRequest<void, string>(URL, "DELETE", {
    params: {
      id,
    },
  })
  return response
}
