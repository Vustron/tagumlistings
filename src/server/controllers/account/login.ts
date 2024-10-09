// utils
import {
  getAccountsFromDB,
  handleErrorResponse,
  findAccountByParams,
  convertAndCheckRateLimit,
} from "@/server/helpers"
import { checkRequiredFields, requestBodyHandler } from "@/lib/utils"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// actions
import { getSession } from "@/lib/actions/session/get"

// configs
import redis from "@/lib/config/redis"

// types
import type { LoginValues } from "@/lib/validation"
import type { NextRequest } from "next/server"
import type { UserData } from "@/lib/types"

export async function loginAccountController(request: NextRequest) {
  try {
    const rateLimitCheck = await convertAndCheckRateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const loginAccountBody = await requestBodyHandler<LoginValues>(request)

    const { email, password } = loginAccountBody

    const requiredFields: (keyof typeof loginAccountBody)[] = [
      "email",
      "password",
    ]

    const errorResponse = checkRequiredFields(loginAccountBody, requiredFields)

    if (errorResponse) return errorResponse

    const databaseKey = "accounts"
    const accounts: UserData[] = await getAccountsFromDB(databaseKey)

    const { account, response } = await findAccountByParams(
      accounts,
      "email",
      email,
    )
    if (response) return response

    const isPasswordValid =
      account && (await bcrypt.compare(password, account.password!))

    if (!account || !isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 },
      )
    }

    const loggedInKey = `loggedIn-${account.id}`
    const loggedIn = await redis.exists(loggedInKey)

    if (loggedIn) {
      return NextResponse.json(
        { error: "Already logged in on another device" },
        { status: 400 },
      )
    }

    if (!loggedIn) {
      account.loggedIn = false
      await redis.set(databaseKey, JSON.stringify(accounts))
    }

    return NextResponse.json(account, {
      status: 200,
    })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
