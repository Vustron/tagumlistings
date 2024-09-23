"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { UserData } from "@/lib/types"

export interface DeleteAccountsProps {
  ids: string[]
}

export async function deleteAccounts(
  ids: DeleteAccountsProps,
): Promise<UserData[]> {
  const URL = "auth/bulk-delete"
  const response = await httpRequest<DeleteAccountsProps, UserData[]>(
    URL,
    "POST",
    {
      body: ids,
    },
  )
  return response
}
