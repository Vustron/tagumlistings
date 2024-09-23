// utils
import { convertAndCheckRateLimit, handleErrorResponse } from "@/lib/helpers"
import { NextResponse } from "next/server"

// actions
import { getSession } from "@/app/(auth)/_actions/session/get"

// configs
import redis from "@/lib/config/redis"

// types
import type { NextRequest } from "next/server"
import type { UserData } from "@/lib/types"

export async function deleteAccountController(request: NextRequest) {
  try {
    const rateLimitCheck = await convertAndCheckRateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 })
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const dbKey = "accounts"
    const existingAccounts = await redis.get(dbKey)
    const accounts: UserData[] = existingAccounts
      ? (JSON.parse(existingAccounts) as UserData[])
      : []

    const accountIndex = accounts.findIndex(
      (account: UserData) => account.id === id,
    )

    if (accountIndex === -1) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    accounts.splice(accountIndex, 1)
    await redis.set(dbKey, JSON.stringify(accounts))

    return NextResponse.json(accounts, {
      status: 200,
    })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
