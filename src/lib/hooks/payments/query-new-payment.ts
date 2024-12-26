"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { getAppointments } from "@/lib/actions/appointment/get-all"
import { getProperties } from "@/lib/actions/property/get-all"
import { getAccounts } from "@/lib/actions/auth/get-all"

export const useQueryNewPaymentData = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["new-payment-data"],
    queryFn: async () => {
      const [accounts, appointments, properties] = await Promise.all([
        getAccounts(),
        getAppointments(),
        getProperties(),
      ])
      return { accounts, appointments, properties }
    },
  })

  return {
    accounts: data?.accounts?.accounts ?? [],
    appointments: data?.appointments?.appointments ?? [],
    properties: data?.properties?.properties ?? [],
  }
}
