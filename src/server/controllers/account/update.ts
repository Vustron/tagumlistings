// utils
import { rateLimit, handleErrorResponse } from "@/server/helpers"
import { checkRequiredFields, requestBodyHandler } from "@/lib/utils"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// actions
import { getSession } from "@/lib/actions/session/get"

// configs
import redis from "@/lib/config/redis"

// types
import type { UpdateAccountValues } from "@/lib/validation"
import type { NextRequest } from "next/server"
import type { UserData } from "@/lib/types"

export async function updateAccountController(request: NextRequest) {
  try {
    const rateLimitCheck = await rateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const updateAccountBody =
      await requestBodyHandler<UpdateAccountValues>(request)

    const {
      id,
      name,
      address,
      contact_number,
      email,
      password,
      newpassword,
      role,
      reservedProperties,
    } = updateAccountBody

    const requiredFields: (keyof typeof updateAccountBody)[] = [
      "id",
      "name",
      "email",
      "contact_number",
    ]

    const errorResponse = checkRequiredFields(updateAccountBody, requiredFields)

    if (errorResponse) return errorResponse

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

    const existingAccount = accounts[accountIndex]

    // variable to hold hashed password
    let hashedPassword = existingAccount?.password

    if (password && newpassword) {
      const passwordMatch = await bcrypt.compare(
        password,
        existingAccount?.password ?? "",
      )

      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Incorrect current password" },
          { status: 401 },
        )
      }

      if (newpassword !== password) {
        hashedPassword = await bcrypt.hash(newpassword, 12)
      }
    }

    const accountEmail = accounts.findIndex(
      (account: UserData) => account.email === email && account.id !== id,
    )

    if (accountEmail !== -1) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 401 },
      )
    }

    const updatedAccount: UserData = {
      ...existingAccount,
      name: name ?? existingAccount?.name!,
      address: address ?? existingAccount?.address!,
      contact_number: contact_number ?? existingAccount?.contact_number!,
      email: email ?? existingAccount?.email!,
      password: hashedPassword,
      role: role ?? existingAccount?.role!,
      reservedProperties:
        reservedProperties ?? existingAccount?.reservedProperties!,
      updatedAt: new Date().toISOString(),
    }

    accounts[accountIndex] = updatedAccount
    await redis.set(dbKey, JSON.stringify(accounts))

    if (session.id === updatedAccount?.id) {
      session.name = updatedAccount.name
      session.email = updatedAccount.email
      session.address = updatedAccount.address
      session.contact_number = updatedAccount.contact_number
      session.role = updatedAccount.role
      session.loggedIn = updatedAccount.loggedIn
      session.reservedProperties = updatedAccount.reservedProperties
      await session.save()
    }

    return NextResponse.json(updatedAccount, {
      status: 200,
    })
  } catch (error) {
    return await handleErrorResponse(error)
  }
}
