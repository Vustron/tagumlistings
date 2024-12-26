import { useSuspenseQuery } from "@tanstack/react-query"

import { getAppointmentDates } from "@/lib/actions/appointment/get-dates"
import { getAppointments } from "@/lib/actions/appointment/get-all"

export const useQueryAppointments = () => {
  const { data: appointmentsData } = useSuspenseQuery({
    queryKey: ["appointments-data"],
    queryFn: async () => {
      const [appointments, appointmentDates] = await Promise.all([
        getAppointments(),
        getAppointmentDates(),
      ])
      return { appointments, appointmentDates }
    },
  })

  return {
    appointments: appointmentsData?.appointments?.appointments ?? [],
    appointmentDates: appointmentsData?.appointmentDates?.dates ?? [],
  }
}
