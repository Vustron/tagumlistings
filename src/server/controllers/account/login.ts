// utils
import {
  getAccountsFromDB,
  handleErrorResponse,
  findAccountByParams,
  rateLimit,
} from "@/server/helpers"
import { checkRequiredFields, requestBodyHandler } from "@/lib/utils"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// actions
import { setSession } from "@/lib/actions/session/set"

// configs
import redis from "@/lib/config/redis"

// types
import type { LoginValues } from "@/lib/validation"
import type { NextRequest } from "next/server"
import type { UserData } from "@/lib/types"

export async function loginAccountController(request: NextRequest) {
  try {
    const rateLimitCheck = await rateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
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

    return await setSession(account)
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
