// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getAppointments } from "@/lib/actions/appointment/get-all"

// types
import type { Appointments } from "@/lib/types"

export const useGetAppointments = () => {
  return useSuspenseQuery<Appointments, Error>({
    queryKey: ["appointments"],
    queryFn: () => getAppointments(),
  })
}
