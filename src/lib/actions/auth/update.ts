// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { UpdateAccountValues } from "@/lib/validation"
import type { SessionData } from "@/lib/config/session"

export async function updateAccount(userData: UpdateAccountValues) {
  const URL = "auth/update"
  const response = await httpRequest<UpdateAccountValues, SessionData>(
    URL,
    "PATCH",
    {
      body: userData,
    },
  )
  return response
}
