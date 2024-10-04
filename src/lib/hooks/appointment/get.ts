"use client"

// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getAppointment } from "@/lib/actions/appointment/get"

// types
import type { Appointment } from "@/lib/types"

export const useGetAppointment = (id: string) => {
  return useSuspenseQuery<Appointment, Error>({
    queryKey: ["appointment", id],
    queryFn: () => getAppointment(id),
  })
}
