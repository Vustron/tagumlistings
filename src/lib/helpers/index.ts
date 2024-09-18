// utils
import redis, { rateLimiter } from "@/lib/config/redis"
import { ErrorHandler } from "@/lib/utils"
import { NextResponse } from "next/server"
import { getClientIp } from "request-ip"
import { routes } from "@/lib/routes"

// types
import type {
  CompatibleRequest,
  ErrorResponseData,
  UserData,
} from "@/lib/types"
import type { NextRequest } from "next/server"
import type { HttpMethod } from "@/lib/routes"

/**------------------util non async functions ------------------**/

// api request handler
export async function handleRequest(
  request: NextRequest,
  method: HttpMethod,
): Promise<NextResponse> {
  const pathname = new URL(request.url).pathname
  const route = routes[method].find((r) => r.path === pathname)

  if (route) {
    try {
      return await route.handler(request)
    } catch (error) {
      console.error(`Error in ${method} ${pathname}:`, error)
      return handleErrorResponse(error)
    }
  }

  return NextResponse.json({ message: "Not Found" }, { status: 404 })
}

// will handle the error messages
export async function handleErrorResponse(error: unknown) {
  // Handle the error using the ErrorHandler
  const { message, statusCode }: ErrorResponseData =
    ErrorHandler.handleError(error)

  // Log the error message
  console.log(message)

  // Return the error response
  return NextResponse.json({ error: message }, { status: statusCode })
}

export async function convertAndCheckRateLimit(request: NextRequest) {
  const compatibleRequest: CompatibleRequest = {
    headers: Object.fromEntries(request.headers.entries()),
    url: request.url,
    method: request.method,
  } as CompatibleRequest

  const clientIp = getClientIp(compatibleRequest) || "NA"

  // Rate limit check
  const limit = await rateLimiter.get({
    id: clientIp,
  })

  if (!limit.remaining) {
    return NextResponse.json(
      {
        error: "Sorry, you are rate limited. Wait for 5 seconds",
      },
      { status: 429 },
    )
  }

  return { clientIp, compatibleRequest }
}

export async function getAccountsFromDB(dbKey: string): Promise<UserData[]> {
  const existingUserData = await redis.get(dbKey)

  const users: UserData[] = existingUserData
    ? (JSON.parse(existingUserData) as UserData[])
    : []

  return users
}

export async function findAccountByParams<T extends keyof UserData>(
  accounts: UserData[],
  param: T,
  value: UserData[T],
): Promise<{ account: UserData | undefined; response?: NextResponse }> {
  // Find the user index based on the dynamic parameter
  const accountIndex = accounts.findIndex(
    (account: UserData) => account[param] === value,
  )

  // Return error response if user isn't found
  if (accountIndex === -1) {
    return {
      account: undefined,
      response: NextResponse.json(
        { error: "Account not found" },
        { status: 404 },
      ),
    }
  }

  // Return the existing user data
  const existingAccount = accounts[accountIndex]
  return { account: existingAccount }
}
