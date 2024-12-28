"use client"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/components/providers/session"
import { useRouter } from "next-nprogress-bar"

// actions
import { updateAppointment } from "@/lib/actions/appointment/update"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { updateAppointmentSchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { UpdateAppointmentValues } from "@/lib/validation"
import type { Appointments, Appointment } from "@/lib/types"
import type { QueryFilters } from "@tanstack/react-query"

const purify = DOMPurify

export const useUpdateAppointment = (id?: string) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const session = useSession()

  return useMutation({
    mutationKey: ["update-appointment", id],
    mutationFn: async (values: UpdateAppointmentValues) => {
      const sanitizedData = sanitizer<UpdateAppointmentValues>(
        values,
        updateAppointmentSchema,
        purify,
      )
      return await updateAppointment(sanitizedData)
    },
    onSuccess: async (updatedAppointment) => {
      const appointmentQueryFilter: QueryFilters = {
        queryKey: ["appointment", id],
      }

      const appointmentsQueryFilter: QueryFilters = {
        queryKey: ["appointments"],
      }

      await queryClient.cancelQueries(appointmentsQueryFilter)
      await queryClient.cancelQueries(appointmentQueryFilter)

      queryClient.setQueryData<Appointment>(["appointment", id], (oldData) => ({
        ...oldData,
        ...updatedAppointment,
      }))

      queryClient.setQueryData<Appointments>(["appointments"], (oldData) => {
        if (!oldData) return { appointments: [updatedAppointment] }
        return {
          ...oldData,
          appointments: oldData.appointments.map((appointment) =>
            appointment.id === id ? updatedAppointment : appointment,
          ),
        }
      })
    },
    onSettled: () => {
      if (session.role === "admin") {
        // router.push("/admin/appointments")
        router.refresh()
        return
      }
      if (session.role === "agent") {
        // router.push("/agent/appointments")
        router.refresh()
        return
      }
      if (session.role === "client") {
        // router.push("/appointments")
        router.refresh()
        return
      }
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
