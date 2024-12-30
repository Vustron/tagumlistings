// config
import { httpRequest } from "@/lib/config/http"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { QueryClient } from "@tanstack/react-query"
import type { Accounts } from "@/lib/types"

export async function getAccounts(): Promise<Accounts> {
  const URL = "auth/get-all"
  return await httpRequest<void, Accounts>(URL, "GET")
}

export async function preFetchAccounts() {
  return async (_queryClient: QueryClient) => {
    return queryOptions<Accounts, Error>({
      queryKey: ["accounts"],
      queryFn: () => getAccounts(),
    })
  }
}
