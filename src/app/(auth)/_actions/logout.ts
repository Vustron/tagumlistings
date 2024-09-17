"use server"

// config
// import { env } from "@/lib/config/env.mjs"

// actions
import { getSession } from "@/app/(auth)/_actions/get-session"

// utils
// import { dataSerializer } from "@/lib/utils"

export async function logout() {
  const session = await getSession()
  session.destroy()
}
