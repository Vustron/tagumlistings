"use server"

// configs
import { env } from "@/lib/config/env.mjs"
import { httpRequest } from "@/lib/config/http"

// types
import type { UpdateAccountValues } from "@/lib/validation"
import type { SessionData } from "@/lib/config/session"

export async function updateAccount(userData: UpdateAccountValues) {
  const URL = `${env.API_URL}/api/account/update/${userData?.id}`
  const response = await httpRequest<UpdateAccountValues, SessionData>(
    URL,
    "PATCH",
    {
      body: userData,
    },
  )
  return response
}
