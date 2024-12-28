import { getAccount } from "@/lib/actions/auth/get"

import { useSession } from "@/components/providers/session"
import { useQuery } from "@tanstack/react-query"

import { isValidSessionData, dataSerializer } from "@/lib/utils"
import { getAccounts } from "@/lib/actions/auth/get-all"

import type { SessionData } from "@/lib/config/session"

export function useQueryAccounts() {
  const session = useSession()

  const query = useQuery({
    queryKey: ["profile", session.id],
    queryFn: async () => {
      const [accountRes, accountsRes] = await Promise.all([
        getAccount(session.id),
        getAccounts(),
      ])

      const userData: SessionData | undefined =
        accountRes && isValidSessionData(accountRes)
          ? dataSerializer<SessionData>(accountRes)
          : undefined

      return {
        user: userData,
        accounts: accountsRes.accounts,
      }
    },
  })

  return {
    user: query.data?.user,
    accounts: query.data?.accounts,
    isLoading: query.isLoading,
    error: query.error,
  }
}
