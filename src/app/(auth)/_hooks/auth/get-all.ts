// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getAccounts } from "@/app/(auth)/_actions/auth/get-all"

// types
import type { Accounts } from "@/app/(auth)/_actions/auth/get-all"

export const useGetAccounts = () => {
  return useSuspenseQuery<Accounts, Error>({
    queryKey: ["accounts"],
    queryFn: () => getAccounts(),
  })
}
