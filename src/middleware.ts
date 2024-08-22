// utils
import { NextResponse, userAgent } from "next/server"

// types
import type { NextRequest } from "next/server"

// middleware
export default function middleware(request: NextRequest) {
  // init bot protection
  const { isBot, ua, browser, device, engine, os, cpu } = userAgent(request)

  // if bot log and block
  if (isBot) {
    // log bot details
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
