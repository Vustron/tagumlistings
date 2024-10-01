// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getAppointmentDates } from "@/lib/actions/appointment/get-dates"

// types
import type { AppointmentDates } from "@/lib/types"

export const useGetAppointmentDates = () => {
  return useSuspenseQuery<AppointmentDates, Error>({
    queryKey: ["appointment-dates"],
    queryFn: () => getAppointmentDates(),
  })
}
