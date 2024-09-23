// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// actions
import { createAppointment } from "@/app/(admin)/_actions/appointment/create"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { addAppointmentSchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { Appointments } from "@/app/(admin)/_components/data/appointments"
import type { AddAppointmentValues } from "@/lib/validation"
import type { QueryFilters } from "@tanstack/react-query"

const purify = DOMPurify

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: ["create-appointment"],
    mutationFn: async (values: AddAppointmentValues) => {
      const sanitizedData = sanitizer<AddAppointmentValues>(
        values,
        addAppointmentSchema,
        purify,
      )
      return await createAppointment(sanitizedData)
    },
    onSuccess: async (newAppointment) => {
      const queryFilter: QueryFilters = {
        queryKey: ["appointments"],
      }

      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<Appointments>(["appointments"], (oldData) => {
        if (!oldData) {
          return { appointments: [newAppointment] }
        }
        return {
          ...oldData,
          appointments: [...oldData.appointments, newAppointment],
        }
      })
    },
    onSettled: () => {
      router.push("/admin/appointments")
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
