"use server"

// configs
import { env } from "@/lib/config/env.mjs"
import { httpRequest } from "@/lib/config/http"

// actions
import { setSession } from "@/app/(auth)/_actions/set-session"

// types
import type { SessionData } from "@/lib/config/session"
import type { LoginValues } from "@/lib/validation"

export async function loginAccount(credentials: LoginValues) {
  const URL = `${env.API_URL}/api/login`
  const data = await httpRequest<LoginValues, SessionData>(URL, "POST", {
    body: credentials,
  })

  const userData: SessionData = {
    id: data.id || "",
    name: data.name || "",
    address: data.address || "",
    contact_number: data.contact_number || "",
    email: data.email || "",
    role: data.role || "",
    loggedIn: true,
  }

  await setSession(userData)
}
