"use client"

// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getAccounts } from "@/lib/actions/auth/get-all"

// types
import type { Accounts } from "@/lib/types"

export const useGetAccounts = () => {
  return useSuspenseQuery<Accounts, Error>({
    queryKey: ["accounts"],
    queryFn: () => getAccounts(),
  })
}
