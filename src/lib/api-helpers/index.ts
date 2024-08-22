// utils
import { ErrorHandler } from "@/lib/utils"
import { NextResponse } from "next/server"

// types
import type { ErrorResponseData } from "@/lib/types"

/**------------------util non async functions ------------------**/

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
