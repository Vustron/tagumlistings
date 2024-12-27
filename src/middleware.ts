// utils
import { getIronSession } from "iron-session"
import { NextResponse } from "next/server"
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
  "/admin/records",
  "/admin/records/*",
  "/admin/messages",
  "/admin/users",
  "/admin/users/*",
  "/admin/account",
  "/agent",
  "/agent/appointments",
  "/agent/appointments/*",
  "/agent/properties",
  "/agent/properties/*",
  "/agent/records",
  "/agent/records/*",
  "/agent/messages",
  "/agent/users",
  "/agent/users/*",
  "/agent/account",
]

const protectedClientRoutes: string[] = [
  "/contact",
  "/appointments",
  "/records/*",
  "/reserved",
  "/records",
]

/**
 * An array of routes that are used for authentication
 * @type {string[]}
 */

const authRoutes: string[] = ["/login", "/register"]

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      path === route ||
      (route.endsWith("*") && path.startsWith(route.slice(0, -1))),
  )
  const isProtectedClientRoute = protectedClientRoutes.includes(path)
  const isAuthRoute = authRoutes.includes(path)
  const isAdminRoute = path.startsWith("/admin")
  const isAgentRoute = path.startsWith("/agent")

  try {
    const response = NextResponse.next()
    const session = await getIronSession<SessionData>(
      request,
      response,
      sessionOptions,
    )

    if (!session.loggedIn && (isProtectedRoute || isProtectedClientRoute)) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (session.loggedIn) {
      if (isAuthRoute) {
        switch (session.role) {
          case "admin":
            return NextResponse.redirect(new URL("/admin", request.url))
          case "agent":
            return NextResponse.redirect(new URL("/agent", request.url))
          default:
            return NextResponse.redirect(new URL("/", request.url))
        }
      }

      if (isAdminRoute && session.role !== "admin") {
        return NextResponse.redirect(new URL("/agent", request.url))
      }

      if (
        isAgentRoute &&
        !(session.role === "agent" || session.role === "admin")
      ) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }

    return response
  } catch (error) {
    console.error("Error processing session:", error)
    toast.error("Error processing session")
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
