"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// actions
import { setSession } from "@/lib/actions/session/set"

// types
import type { LoginValues } from "@/lib/validation"
import type { UserData } from "@/lib/types"

export async function loginAccount(credentials: LoginValues) {
  const URL = "auth/login"
  const data = await httpRequest<LoginValues, UserData>(URL, "POST", {
    body: credentials,
  })

  const userData: UserData = {
    id: data.id || "",
    address: data.address || "",
    name: data.name || "",
    contact_number: data.contact_number || "",
    email: data.email || "",
    role: data.role || "",
    loggedIn: true,
    reservedProperties: data.reservedProperties || [],
  }

  await setSession(userData)
  return data
}
