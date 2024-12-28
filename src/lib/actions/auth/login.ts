// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { LoginValues } from "@/lib/validation"
import type { UserData } from "@/lib/types"

export async function loginAccount(credentials: LoginValues) {
  const URL = "auth/login"
  return await httpRequest<LoginValues, UserData>(URL, "POST", {
    body: credentials,
  })
}
