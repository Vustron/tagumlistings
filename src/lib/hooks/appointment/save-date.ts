"use client"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/components/providers/session"
import { useRouter } from "next-nprogress-bar"

// actions
import { saveAppointmentDate } from "@/lib/actions/appointment/save"

// utils
import { clientErrorHandler } from "@/lib/utils"

// types
import type { AddAppointmentDateValues } from "@/lib/validation"
import type { QueryFilters } from "@tanstack/react-query"

// types
import type { AppointmentDates } from "@/lib/types"

export const useSaveAppointmentDate = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const session = useSession()

  return useMutation({
    mutationKey: ["save-appointment-date"],
    mutationFn: async (values: AddAppointmentDateValues) =>
      await saveAppointmentDate(values),
    onSuccess: async (newAppointmentDate) => {
      const queryFilter: QueryFilters = {
        queryKey: ["appointment-dates"],
      }

      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<AppointmentDates>(
        ["appointment-dates"],
        (oldData) => {
          if (oldData) {
            return { dates: [...oldData.dates, newAppointmentDate] }
          }
          return { dates: [newAppointmentDate] }
        },
      )
    },
    onSettled: () => {
      if (session.role !== "admin") {
        return router.push("/appointments")
      }
      router.push("/admin/properties")
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
