// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { UserData } from "@/lib/types"

export async function deleteAccount(id: string): Promise<UserData[]> {
  const URL = "auth/delete"
  const response = await httpRequest<void, UserData[]>(URL, "DELETE", {
    params: {
      id,
    },
  })
  return response
}
