"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { getAppointments } from "@/lib/actions/appointment/get-all"
import { getProperties } from "@/lib/actions/property/get-all"
import { getPayments } from "@/lib/actions/payment/get-all"

export const useQueryDashboardData = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const [appointments, properties, payments] = await Promise.all([
        getAppointments(),
        getProperties(),
        getPayments(),
      ])
      return { appointments, properties, payments }
    },
  })

  return {
    appointments: data?.appointments?.appointments ?? [],
    properties: data?.properties?.properties ?? [],
    payments: data?.payments?.payments ?? [],
  }
}
