// utils
import { handleErrorResponse, rateLimit } from "@/server/helpers"
import { checkRequiredFields, requestBodyHandler } from "@/lib/utils"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// configs
import redis from "@/lib/config/redis"

// types
import type {
  UserData,
  ResetPasswordData,
  RequestResetPassword,
} from "@/lib/types"
import type { NextRequest } from "next/server"

// reset password handler
export async function resetPasswordControl(request: NextRequest) {
  try {
    // init rate limitter
    const rateLimitCheck = await rateLimit(request)

    if (rateLimitCheck instanceof NextResponse) {
      // check rate limit
      return rateLimitCheck
    }

    // get new password body
    const newPasswordBody =
      await requestBodyHandler<RequestResetPassword>(request)

    // set parsed data
    const { token, password } = newPasswordBody

    // throw error if any required fields are missing
    const requiredFields: (keyof typeof newPasswordBody)[] = [
      "token",
      "password",
    ]

    // check if the required fields are there on the request
    const errorResponse = checkRequiredFields(newPasswordBody, requiredFields)

    if (errorResponse)
      // throw error
      return errorResponse

    // init key for users
    const databaseKey = "accounts"

    // init key for verification token
    const resetPasswordDatabaseKey = `reset-password-tokens_${token}`

    // get the verification token database name using key
    const existingResetPasswordTokenRaw = await redis.get(
      resetPasswordDatabaseKey,
    )

    if (!existingResetPasswordTokenRaw) {
      // check if existingVerificationTokenDataRaw is null
      return NextResponse.json(
        { error: "No verification token found" },
        { status: 404 },
      )
    }

    // parse the verification token data
    const existingResetPasswordTokenData: ResetPasswordData = JSON.parse(
      existingResetPasswordTokenRaw,
    ) as ResetPasswordData

    // get users from db
    const existingUserData = await redis.get(databaseKey)

    // set all the user data in an array then parse
    const users: UserData[] = existingUserData
      ? (JSON.parse(existingUserData) as UserData[])
      : []

    // find the existing user
    const userIndex = users.findIndex(
      (user: UserData) => user.email === existingResetPasswordTokenData?.email,
    )

    if (userIndex === -1) {
      // throw error if user isn't found
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // set current user data from db
    const existingUser = users[userIndex]

    if (!existingUser) {
      // ensure existingUser is defined
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (existingResetPasswordTokenData.resetPasswordToken === token) {
      // check verification token
      // encrypt the new password
      const hashedPassword = await bcrypt.hash(password, 12)
      // set the verification date
      existingUser.password = hashedPassword

      // delete the verified token
      await redis.del(resetPasswordDatabaseKey)

      // update user data in Redis
      users[userIndex] = existingUser

      // set the updated data
      await redis.set(databaseKey, JSON.stringify(users))

      return NextResponse.json(
        { message: "Password reset successful" },
        { status: 200 },
      )
    }

    return NextResponse.json(
      { error: "Invalid reset password token" },
      { status: 400 },
    )
  } catch (error) {
    return handleErrorResponse(error)
  }
}
