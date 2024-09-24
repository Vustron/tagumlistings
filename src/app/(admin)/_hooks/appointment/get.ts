// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getAppointment } from "@/app/(admin)/_actions/appointment/get"

// types
import type { Appointment } from "@/app/(admin)/_components/appointments/new"

export const useGetAppointment = (id: string) => {
  return useSuspenseQuery<Appointment, Error>({
    queryKey: ["appointment", id],
    queryFn: () => getAppointment(id),
  })
}
