"use server"

// actions
import { getSession } from "@/app/(auth)/_actions/get-session"

// types
import type { SessionData } from "@/lib/config/session"

export async function setSession(userData: SessionData) {
  const session = await getSession()

  session.id = userData.id
  session.name = userData.name
  session.address = userData.address
  session.contact_number = userData.contact_number
  session.email = userData.email
  session.role = userData.role
  session.loggedIn = true

  await session.save()
}
