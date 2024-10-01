"use server"

// config
import redis from "@/lib/config/redis"

// actions
import { getSession } from "@/lib/actions/session/get"

// types
import type { SessionData } from "@/lib/config/session"

export async function logout() {
  const session = await getSession()

  const dbKey = "accounts"
  const existingAccounts = await redis.get(dbKey)

  const accounts: SessionData[] = existingAccounts
    ? (JSON.parse(existingAccounts) as SessionData[])
    : []

  const accountIndex = accounts.findIndex(
    (account: SessionData) => account.id === session.id,
  )

  if (accountIndex === -1) {
    return Response.json({ error: "User not found" }, { status: 404 })
  }

  const currentAccount = accounts[accountIndex]

  currentAccount!.loggedIn = false

  await redis.set(dbKey, JSON.stringify(accounts))

  const loggedInKey = `loggedIn-${session.id}`
  await redis.del(loggedInKey)

  session.destroy()
}
