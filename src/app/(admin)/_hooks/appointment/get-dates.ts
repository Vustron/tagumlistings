// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getAppointmentDates } from "@/app/(admin)/_actions/appointment/get-dates"

// types
import type { AppointmentDates } from "@/app/(admin)/_actions/appointment/get-dates"

export const useGetAppointmentDates = () => {
  return useSuspenseQuery<AppointmentDates, Error>({
    queryKey: ["appointment-dates"],
    queryFn: () => getAppointmentDates(),
  })
}
