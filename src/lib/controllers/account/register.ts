// utils
import {
  checkRequiredFields,
  createUniqueId,
  requestBodyHandler,
} from "@/lib/utils"
import {
  convertAndCheckRateLimit,
  getAccountsFromDB,
  handleErrorResponse,
} from "@/lib/helpers"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// actions
import { getSession } from "@/app/(auth)/_actions/session/get"

// configs
import redis from "@/lib/config/redis"

// types
import type { NextRequest } from "next/server"
import type { RegisterValues } from "@/lib/validation"
import type { UserData } from "@/lib/types"

export async function registerAccountController(request: NextRequest) {
  try {
    const rateLimitCheck = await convertAndCheckRateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const createAccountBody = await requestBodyHandler<RegisterValues>(request)

    const { name, address, contact_number, email, password } = createAccountBody

    const requiredFields: (keyof typeof createAccountBody)[] = [
      "name",
      "address",
      "contact_number",
      "email",
      "password",
    ]

    const errorResponse = checkRequiredFields(createAccountBody, requiredFields)

    if (errorResponse) return errorResponse

    const databaseKey = "accounts"
    const accounts: UserData[] = await getAccountsFromDB(databaseKey)

    if (accounts.some((account) => account.email === email)) {
      return NextResponse.json(
        { error: "Account already exists" },
        { status: 404 },
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newAccount = {
      id: createUniqueId(),
      address,
      name,
      contact_number,
      email,
      role: "client",
      password: hashedPassword,
      loggedIn: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    accounts.push(newAccount)
    await redis.set(databaseKey, JSON.stringify(accounts))

    return NextResponse.json(newAccount, {
      status: 200,
    })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
