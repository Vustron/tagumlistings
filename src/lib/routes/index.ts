// imagekit controllers
import { imagekitAuthController } from "@/lib/controllers/imagekit/auth"

// account controllers
import { deleteAccountsController } from "@/lib/controllers/account/bulk-delete"
import { registerAccountController } from "@/lib/controllers/account/register"
import { updateAccountController } from "@/lib/controllers/account/update"
import { deleteAccountController } from "@/lib/controllers/account/delete"
import { getAccountsController } from "@/lib/controllers/account/get-all"
import { loginAccountController } from "@/lib/controllers/account/login"
import { getAccountController } from "@/lib/controllers/account/get"

// property controllers
import { deletePropertiesController } from "@/lib/controllers/property/bulk-delete"
import { createPropertyController } from "@/lib/controllers/property/create"
import { updatePropertyController } from "@/lib/controllers/property/update"
import { getPropertiesController } from "@/lib/controllers/property/get-all"
import { deletePropertyController } from "@/lib/controllers/property/delete"
import { getPropertyController } from "@/lib/controllers/property/get"

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
    { path: "/api/v1/property/get-all", handler: getPropertiesController },
    { path: "/api/v1/property/get", handler: getPropertyController },
  ],
  POST: [
    { path: "/api/v1/auth/register", handler: registerAccountController },
    { path: "/api/v1/auth/login", handler: loginAccountController },
    { path: "/api/v1/auth/bulk-delete", handler: deleteAccountsController },
    { path: "/api/v1/property/create", handler: createPropertyController },
    {
      path: "/api/v1/property/bulk-delete",
      handler: deletePropertiesController,
    },
  ],
  PATCH: [
    { path: "/api/v1/auth/update", handler: updateAccountController },
    { path: "/api/v1/property/update", handler: updatePropertyController },
  ],
  DELETE: [
    { path: "/api/v1/auth/delete", handler: deleteAccountController },
    { path: "/api/v1/property/delete", handler: deletePropertyController },
  ],
}
