"use server"

// actions
import { getSession } from "@/app/(auth)/_actions/session/get"

// configs
import redis from "@/lib/config/redis"

// utils
import { getAccountsFromDB } from "@/lib/helpers"
import { NextResponse } from "next/server"

// types
import type { UserData } from "@/lib/types"

export async function setSession(account: UserData) {
  const session = await getSession()

  session.id = account?.id!
  session.name = account.name
  session.address = account.address
  session.contact_number = account.contact_number
  session.email = account.email
  session.role = account.role
  session.loggedIn = account.loggedIn

  await session.save()

  const databaseKey = "accounts"
  const accounts: UserData[] = await getAccountsFromDB(databaseKey)

  const accountIndex = accounts.findIndex((a) => a.id === account.id)
  if (accountIndex !== -1) {
    accounts[accountIndex]!.loggedIn = true
    await redis.set(databaseKey, JSON.stringify(accounts))
  }

  const loggedInKey = `loggedIn-${account.id}`
  await redis.set(loggedInKey, "true", "EX", 86400)

  return NextResponse.json({ message: "Login Successful" }, { status: 200 })
}
