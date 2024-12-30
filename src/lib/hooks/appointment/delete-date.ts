"use client"

// action
import { deleteAppointmentDate } from "@/lib/actions/appointment/delete-date"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { useSession } from "@/components/providers/session"
import { useRouter } from "next-nprogress-bar"

// utils
import { clientErrorHandler } from "@/lib/utils"

// types
import type { QueryFilters } from "@tanstack/react-query"
import type { AppointmentDates } from "@/lib/types"

export const useDeleteAppointmentDate = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  // const session = useSession()

  return useMutation({
    mutationKey: ["delete-appointment-date"],
    mutationFn: async (id: string) => await deleteAppointmentDate(id),
    onSuccess: async (deletedId: string) => {
      const queryFilter: QueryFilters = {
        queryKey: ["appointment-dates"],
      }

      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<AppointmentDates>(
        ["appointment-dates"],
        (oldData) => {
          if (!oldData) return undefined

          return {
            ...oldData,
            dates: oldData.dates.filter((date) => date.id !== deletedId),
          }
        },
      )
    },
    onSettled: async () => {
      // if (session.role === "admin") {
      //   router.push("/admin/appointments")
      //   router.refresh()
      //   return
      // }
      // if (session.role === "agent") {
      //   router.push("/agent/appointments")
      //   router.refresh()
      //   return
      // }
      // if (session.role === "client") {
      //   router.push("/appointments")
      //   router.refresh()
      //   return
      // }
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
