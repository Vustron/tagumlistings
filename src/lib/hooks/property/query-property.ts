"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { getAccounts } from "@/lib/actions/auth/get-all"
import { getProperty } from "@/lib/actions/property/get"

export const useQueryPropertyData = (id: string) => {
  const { data } = useSuspenseQuery({
    queryKey: ["property-data", id],
    queryFn: async () => {
      const [property, accounts] = await Promise.all([
        getProperty(id),
        getAccounts(),
      ])
      return { property, accounts }
    },
  })

  return {
    data: data?.property,
    accounts: data?.accounts?.accounts ?? [],
  }
}
