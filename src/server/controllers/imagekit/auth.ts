// utils
import { handleErrorResponse } from "@/server/helpers"
import { createUniqueId } from "@/lib/utils"
import { NextResponse } from "next/server"
import crypto from "node:crypto"

// configs
import { env } from "@/lib/config/env"

// types
import type { NextRequest } from "next/server"

// imagekit auth handler
export async function imagekitAuthController(request: NextRequest) {
  try {
    const privateKey = env.PRIVATE_KEY

    const { searchParams } = new URL(request.url)

    const token = searchParams.get("token") || createUniqueId()
    const expire =
      searchParams.get("expire") ||
      (Math.floor(Date.now() / 1000) + 2400).toString()
    const privateAPIKey = privateKey
    const signature = crypto
      .createHmac("sha1", privateAPIKey)
      .update(token + expire)
      .digest("hex")

    const imagekitAuth = {
      token,
      expire,
      signature,
    }

    return NextResponse.json(imagekitAuth, {
      status: 200,
    })
  } catch (error) {
    return handleErrorResponse(error)
  }
}
