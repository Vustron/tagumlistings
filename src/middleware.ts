// utils
import { NextResponse, userAgent } from "next/server"

// types
import type { NextRequest } from "next/server"
import type { SessionData } from "@/lib/config/session"

/**
 * An array of routes that are protected
 * @type {string[]}
 */

const protectedRoutes: string[] = [
  "/admin",
  "/admin/appointments",
  "/admin/appointments/*",
  "/admin/properties",
  "/admin/properties/*",
  "/admin/payments",
  "/admin/payments/*",
  "/admin/messages",
  "/admin/users",
  "/admin/users/*",
  "/admin/account",
]

/**
 * An array of routes that are used for authentication
 * @type {string[]}
 */

const authRoutes: string[] = ["/login", "/register"]

/**
 * Prefix for API authentication routes
 * Routes with this prefix are used for API authentication
 * @type {string}
 */

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isAuthRoute = authRoutes.includes(path)

  const authSession = request.cookies.get("client-auth-session")?.value

  if (!authSession && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (authSession) {
    const auth: SessionData = JSON.parse(JSON.stringify(authSession))

    if (!authSession && isProtectedRoute && auth.id === undefined) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (isAuthRoute && authSession) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  const { isBot, ua, browser, device, engine, os, cpu } = userAgent(request)

  if (isBot) {
    console.log("Bot detected:", {
      userAgent: ua,
      browserName: browser.name,
      browserVersion: browser.version,
      deviceModel: device.model,
      deviceType: device.type,
      deviceVendor: device.vendor,
      engineName: engine.name,
      engineVersion: engine.version,
      osName: os.name,
      osVersion: os.version,
      cpuArchitecture: cpu.architecture,
    })

    return NextResponse.json(
      { message: "Bot detected" },
      {
        status: 400,
      },
    )
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
