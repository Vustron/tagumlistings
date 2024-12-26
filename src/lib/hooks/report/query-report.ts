"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { getAppointments } from "@/lib/actions/appointment/get-all"
import { getPayments } from "@/lib/actions/payment/get-all"

export const useQueryReportData = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["report-data"],
    queryFn: async () => {
      const [payments, appointments] = await Promise.all([
        getPayments(),
        getAppointments(),
      ])
      return { payments, appointments }
    },
  })

  const payments = data?.payments?.payments ?? []
  const appointments = data?.appointments?.appointments ?? []
  const paymentsCount = payments.length
  const appointmentsCount = appointments.length
  const totalReports = paymentsCount + appointmentsCount

  return {
    payments,
    appointments,
    paymentsCount,
    appointmentsCount,
    totalReports,
  }
}
