"use server"

// config
import { defaultSession, sessionOptions } from "@/lib/config/session"

// utils
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"

// types
import type { SessionData } from "@/lib/config/session"

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)

  if (!session.loggedIn) {
    session.loggedIn = defaultSession.loggedIn
  }

  if (!session.id) {
    session.id = defaultSession.id
  }

  return session
}
