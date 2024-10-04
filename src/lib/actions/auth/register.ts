// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { RegisterValues } from "@/lib/validation"
import type { SessionData } from "@/lib/config/session"

export async function registerAccount(credentials: RegisterValues) {
  const URL = "auth/register"
  const response = await httpRequest<RegisterValues, SessionData>(URL, "POST", {
    body: credentials,
  })
  return response
}
