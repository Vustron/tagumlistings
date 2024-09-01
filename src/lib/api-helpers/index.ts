// route controllers
import { imagekitAuthControl } from "@/lib/controllers/imagekit/auth"

// utils
import { ErrorHandler } from "@/lib/utils"
import { NextResponse } from "next/server"

// types
import type { ErrorResponseData } from "@/lib/types"
import type { NextRequest } from "next/server"

/**------------------util non async functions ------------------**/

// types
type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE"

interface Route {
  path: string
  handler: (request: NextRequest) => Promise<NextResponse>
}

const routes: Record<HttpMethod, Route[]> = {
  GET: [
    { path: "/api/v1/auth/imagekit", handler: imagekitAuthControl },
    // { path: "/api/v1/auth/get-accounts", handler: getAccountsControl },
  ],
  POST: [
    // { path: "/api/v1/auth/login-account", handler: loginAccountControl },
  ],
  PATCH: [
    // { path: "/api/v1/auth/update-account", handler: updateAccountControl },
  ],
  DELETE: [
    // { path: "/api/v1/auth/delete-account", handler: deleteAccountControl },
  ],
}

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
