"use server"

// config
import { env } from "@/lib/config/env.mjs"
import { httpRequest } from "@/lib/config/http"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { SessionData } from "@/lib/config/session"

export async function getAccount(id: string | undefined): Promise<SessionData> {
  const URL = `${env.API_URL}/api/account/get/${id}`
  const data = await httpRequest<SessionData, SessionData>(URL, "GET")
  return data
}

export async function preFetchAccount(id: string) {
  return queryOptions<SessionData, Error>({
    enabled: !!id,
    queryKey: ["account", id],
    queryFn: () => getAccount(id),
  })
}
