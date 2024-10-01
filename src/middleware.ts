// utils
import { NextResponse, userAgent } from "next/server"
import { getIronSession } from "iron-session"
import toast from "react-hot-toast"

// types
import type { SessionData } from "@/lib/config/session"
import type { NextRequest } from "next/server"

// config
import { sessionOptions } from "@/lib/config/session"

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

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isAuthRoute = authRoutes.includes(path)

  try {
    const response = NextResponse.next()
    const session = await getIronSession<SessionData>(
      request,
      response,
      sessionOptions,
    )

    if (!session.loggedIn && isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (session.loggedIn) {
      if (isAuthRoute) {
        if (session.role === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url))
        }
        return NextResponse.redirect(new URL("/", request.url))
      }

      if (isProtectedRoute && session.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  } catch (error) {
    console.error("Error processing session:", error)
    toast.error("Error processing session")
    return NextResponse.redirect(new URL("/login", request.url))
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
