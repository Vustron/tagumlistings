"use server"

// config
import { env } from "@/lib/config/env.mjs"
import { httpRequest } from "@/lib/config/http"

// actions
import { getSession } from "@/app/(auth)/_actions/get-session"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { SessionData } from "@/lib/config/session"

export interface Accounts {
  accounts: SessionData[]
}

export async function getAccounts(): Promise<Accounts> {
  const URL = `${env.API_URL}/api/account/get`
  const { accounts } = await httpRequest<void, Accounts>(URL, "GET")

  const session = await getSession()

  const filteredAccounts = accounts.filter(
    (account) => account.id !== session.id,
  )

  return { accounts: filteredAccounts }
}

export async function preFetchAccounts() {
  return queryOptions<Accounts, Error>({
    queryKey: ["accounts"],
    queryFn: () => getAccounts(),
  })
}
