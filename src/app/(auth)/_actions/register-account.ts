"use server"

// configs
import { env } from "@/lib/config/env.mjs"
import { httpRequest } from "@/lib/config/http"

// types
import type { RegisterValues } from "@/lib/validation"
import type { SessionData } from "@/lib/config/session"

export async function registerAccount(credentials: RegisterValues) {
  const URL = `${env.API_URL}/api/register`
  const response = await httpRequest<RegisterValues, SessionData>(URL, "POST", {
    body: credentials,
  })
  return response
}
