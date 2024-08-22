// utils
import { handleErrorResponse } from "@/lib/api-helpers"
import { NextResponse } from "next/server"

// get hello world handler
export async function helloController() {
  try {
    return NextResponse.json(
      { message: "Hello world" },
      {
        status: 200,
      },
    )
  } catch (error) {
    return handleErrorResponse(error)
  }
}
