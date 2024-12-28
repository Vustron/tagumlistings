import { useSuspenseQuery } from "@tanstack/react-query"

import { getAppointmentDates } from "@/lib/actions/appointment/get-dates"
import { getAppointment } from "@/lib/actions/appointment/get"
import { getAccounts } from "@/lib/actions/auth/get-all"

export const useQueryAppointment = (id: string) => {
  const { data: accountsData } = useSuspenseQuery({
    queryKey: ["appointment", id],
    queryFn: () =>
      Promise.all([getAccounts(), getAppointment(id), getAppointmentDates()]),
  })

  return {
    accounts: accountsData?.[0].accounts ?? [],
    appointment: accountsData?.[1],
    appointmentDates: accountsData?.[2].dates ?? [],
  }
}
