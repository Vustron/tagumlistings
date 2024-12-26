"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { getAppointments } from "@/lib/actions/appointment/get-all"
import { getProperties } from "@/lib/actions/property/get-all"
import { getPayment } from "@/lib/actions/payment/get"
import { getAccounts } from "@/lib/actions/auth/get-all"

export const useQueryPaymentData = (id: string) => {
  const { data } = useSuspenseQuery({
    queryKey: ["payment-data", id],
    queryFn: async () => {
      const [accounts, appointments, properties, payment] = await Promise.all([
        getAccounts(),
        getAppointments(),
        getProperties(),
        getPayment(id),
      ])
      return { accounts, appointments, properties, payment }
    },
  })

  return {
    accounts: data?.accounts?.accounts ?? [],
    appointments: data?.appointments?.appointments ?? [],
    properties: data?.properties?.properties ?? [],
    payment: data?.payment,
  }
}
