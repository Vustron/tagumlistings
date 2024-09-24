"use client"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// actions
import { updateAppointment } from "@/app/(admin)/_actions/appointment/update"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { updateAppointmentSchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { Appointments } from "@/app/(admin)/_components/data/appointments"
import type { Appointment } from "@/app/(admin)/_components/appointments/new"
import type { UpdateAppointmentValues } from "@/lib/validation"
import type { QueryFilters } from "@tanstack/react-query"

const purify = DOMPurify

export const useUpdateAppointment = (id?: string) => {
  const queryClient = useQueryClient()
  const router = useRouter()

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
        queryKey: ["appointments", id],
      }

      const appointmentsQueryFilter: QueryFilters = {
        queryKey: ["appointments"],
      }

      await queryClient.cancelQueries(appointmentsQueryFilter)
      await queryClient.cancelQueries(appointmentQueryFilter)

      queryClient.setQueryData<Appointment>(
        ["appointments", id],
        (oldData) => ({
          ...oldData,
          ...updatedAppointment,
        }),
      )

      queryClient.setQueryData<Appointments>(["appointments"], (oldData) => {
        if (!oldData) return { appointments: [updatedAppointment] }
        return {
          ...oldData,
          appointments: oldData.appointments.map((appointment) =>
            appointment.id === id ? updatedAppointment : appointment,
          ),
        }
      })
      router.push("/admin/appointments")
      router.refresh()
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
