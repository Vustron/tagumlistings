// utils
import { handleErrorResponse } from "@/lib/helpers"
import { NextResponse } from "next/server"

// actions
import { getSession } from "@/lib/actions/session/get"

// configs
import redis from "@/lib/config/redis"

// types
import type { UserData } from "@/lib/types"

export async function getAccountsController() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const databaseKey = "accounts"
    const existingAccounts = await redis.get(databaseKey)

    let accounts: UserData[] = existingAccounts
      ? (JSON.parse(existingAccounts) as UserData[])
      : []

    accounts = accounts.filter((account) => account.id !== session.id)

    return NextResponse.json(
      { accounts },
      {
        status: 200,
      },
    )
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
