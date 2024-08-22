// account controllers
import { helloController } from "@/lib/controllers/hello"

// utils
import { NextResponse } from "next/server"

// types
import type { NextRequest } from "next/server"

// GET handlers
export async function GET(
  request: NextRequest,
): Promise<NextResponse | Response | undefined> {
  // init pathname
  const pathname = new URL(request.url).pathname

  switch (pathname) {
    // get accounts
    case "/api/v1/hello":
      return helloController()

    default:
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 },
      )
  }
}

// POST handlers
export async function POST(
  request: NextRequest,
): Promise<NextResponse | Response> {
  // init pathname
  const pathname = new URL(request.url).pathname

  switch (pathname) {
    // login account
    // case "/api/v1/auth/login-account":
    //   return loginAccountControl(request)

    default:
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 },
      )
  }
}

// PATCH handlers
export async function PATCH(
  request: NextRequest,
): Promise<NextResponse | Response> {
  // init pathname
  const pathname = new URL(request.url).pathname

  switch (pathname) {
    // update account
    // case "/api/v1/auth/update-account":
    //   return updateAccountControl(request)

    default:
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 },
      )
  }
}

// DELETE handlers
export async function DELETE(
  request: NextRequest,
): Promise<NextResponse | Response> {
  // init pathname
  const pathname = new URL(request.url).pathname

  switch (pathname) {
    // delete account
    // case "/api/v1/auth/delete-account":
    //   return deleteAccountControl(request)

    default:
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 },
      )
  }
}
