"use server"

// config
import redis from "@/lib/config/redis"

// actions
import { getSession } from "@/lib/actions/session/get"
import { setSession } from "@/lib/actions/session/set"

// types
import type { UserData } from "@/lib/types"

export async function accountSwitch(newAccount: UserData) {
  try {
    // Get current session and clear it
    const currentSession = await getSession()
    if (currentSession) {
      const loggedInKey = `loggedIn-${currentSession.id}`
      await redis.del(loggedInKey)
      currentSession.destroy()
    }

    // Set up new session
    await setSession(newAccount)

    // Set logged in status in Redis
    const newLoggedInKey = `loggedIn-${newAccount.id}`
    await redis.set(newLoggedInKey, "true", "EX", 86400)

    return { success: true }
  } catch (error) {
    console.error("Error switching account:", error)
    throw new Error("Failed to switch account")
  }
}
