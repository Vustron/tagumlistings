"use server"

// configs
import { env } from "@/lib/config/env.mjs"
import { httpRequest } from "@/lib/config/http"

// types
import type { RegisterValues } from "@/lib/validation"

/* register account */
export async function registerAccount(credentials: RegisterValues) {
  // set url
  const URL = `${env.API_URL}/api/register`

  // init http post method
  const data = await httpRequest<RegisterValues, void>(URL, "POST", {
    body: credentials,
  })
  return data
}
