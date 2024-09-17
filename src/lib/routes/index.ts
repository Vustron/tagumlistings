// route controllers
import { imagekitAuthControl } from "@/lib/controllers/imagekit/auth"

// types
import type { NextRequest, NextResponse } from "next/server"

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE"

interface Route {
  path: string
  handler: (request: NextRequest) => Promise<NextResponse>
}

export const routes: Record<HttpMethod, Route[]> = {
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
