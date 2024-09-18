"use client"

// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getAccount } from "@/app/(auth)/_actions/get-account"

// types
import type { UserData } from "@/lib/types"

export const useGetAccount = (id: string) => {
  return useSuspenseQuery<UserData, Error>({
    queryKey: ["account", id],
    queryFn: () => getAccount(id),
  })
}
