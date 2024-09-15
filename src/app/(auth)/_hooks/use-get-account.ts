"use client"

// hooks
import { useQuery } from "@tanstack/react-query"

// actions
import { getAccount } from "@/app/(auth)/_actions/get-account"

// types
import type { SessionData } from "@/lib/config/session"

export const useGetAccount = (id: string | undefined) => {
  return useQuery<SessionData, Error>({
    enabled: !!id,
    queryKey: ["account", id],
    queryFn: () => getAccount(id),
  })
}
