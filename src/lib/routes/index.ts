// route controllers
import { deleteAccountsController } from "@/lib/controllers/account/bulk-delete"
import { registerAccountController } from "@/lib/controllers/account/register"
import { updateAccountController } from "@/lib/controllers/account/update"
import { deleteAccountController } from "@/lib/controllers/account/delete"
import { getAccountsController } from "@/lib/controllers/account/get-all"
import { imagekitAuthController } from "@/lib/controllers/imagekit/auth"
import { loginAccountController } from "@/lib/controllers/account/login"
import { getAccountController } from "@/lib/controllers/account/get"

// types
import type { NextRequest, NextResponse } from "next/server"

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE"

interface Route {
  path: string
  handler: (request: NextRequest) => Promise<NextResponse>
}

export const routes: Record<HttpMethod, Route[]> = {
  GET: [
    { path: "/api/v1/auth/imagekit", handler: imagekitAuthController },
    { path: "/api/v1/auth/get", handler: getAccountController },
    { path: "/api/v1/auth/get-all", handler: getAccountsController },
  ],
  POST: [
    { path: "/api/v1/auth/register", handler: registerAccountController },
    { path: "/api/v1/auth/login", handler: loginAccountController },
    { path: "/api/v1/auth/bulk-delete", handler: deleteAccountsController },
  ],
  PATCH: [
    { path: "/api/v1/auth/update", handler: updateAccountController },
    // { path: "/api/v1/auth/update-account", handler: updateAccountControl },
  ],
  DELETE: [
    { path: "/api/v1/auth/delete", handler: deleteAccountController },
    // { path: "/api/v1/auth/update-account", handler: updateAccountControl },
  ],
}
