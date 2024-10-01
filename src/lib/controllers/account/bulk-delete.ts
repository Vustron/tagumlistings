// utils
import { convertAndCheckRateLimit, handleErrorResponse } from "@/lib/helpers"
import { requestBodyHandler } from "@/lib/utils"
import { NextResponse } from "next/server"

// actions
import { getSession } from "@/lib/actions/session/get"

// configs
import redis from "@/lib/config/redis"

// types
import type { NextRequest } from "next/server"
import type { UserData } from "@/lib/types"

export async function deleteAccountsController(request: NextRequest) {
  try {
    const rateLimitCheck = await convertAndCheckRateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const { ids } = await requestBodyHandler<{ ids: string[] }>(request)

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 })
    }

    const dbKey = "accounts"
    const existingAccounts = await redis.get(dbKey)
    const accounts: UserData[] = existingAccounts
      ? (JSON.parse(existingAccounts) as UserData[])
      : []

    const hasId = (account: UserData): account is UserData & { id: string } =>
      typeof account.id === "string"

    const remainingAccounts = accounts.filter(
      (account) => hasId(account) && !ids.includes(account.id),
    )

    if (remainingAccounts.length === accounts.length) {
      return NextResponse.json(
        { error: "No accounts found to delete" },
        { status: 404 },
      )
    }

    await redis.set(dbKey, JSON.stringify(remainingAccounts))

    return NextResponse.json(remainingAccounts, {
      status: 200,
    })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
