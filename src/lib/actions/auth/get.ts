// config
import { httpRequest } from "@/lib/config/http"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { SessionData } from "@/lib/config/session"
import type { UserData } from "@/lib/types"

export async function getAccount(id: string): Promise<UserData> {
  const URL = "auth/get"
  const data = await httpRequest<SessionData, UserData>(URL, "GET", {
    params: {
      id,
    },
  })
  return data
}

export async function preFetchAccount(id: string) {
  return queryOptions<UserData, Error>({
    enabled: !!id,
    queryKey: ["account", id],
    queryFn: () => getAccount(id),
  })
}
