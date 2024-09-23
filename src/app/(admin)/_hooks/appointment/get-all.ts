// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getAppointments } from "@/app/(admin)/_actions/appointment/get-all"

// types
import type { Appointments } from "@/app/(admin)/_components/data/appointments"

export const useGetAppointments = () => {
  return useSuspenseQuery<Appointments, Error>({
    queryKey: ["appointments"],
    queryFn: () => getAppointments(),
  })
}
