// hooks
import { useQuery } from "@tanstack/react-query"

// actions
import { getAccounts } from "@/app/(auth)/_actions/get-accounts"

// types
import type { Accounts } from "@/app/(auth)/_actions/get-accounts"

export const useGetAccounts = () => {
  return useQuery<Accounts, Error>({
    queryKey: ["accounts"],
    queryFn: () => getAccounts(),
  })
}
