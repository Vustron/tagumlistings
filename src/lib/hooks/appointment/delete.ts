"use client"

// action
import { deleteAppointment } from "@/lib/actions/appointment/delete"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/components/providers/session"
import { useRouter } from "next-nprogress-bar"

// utils
import { clientErrorHandler } from "@/lib/utils"

// types
import type { QueryFilters } from "@tanstack/react-query"
import type { Appointments } from "@/lib/types"

export const useDeleteAppointment = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const session = useSession()

  return useMutation({
    mutationKey: ["delete-appointment"],
    mutationFn: async (id: string) => await deleteAppointment(id),
    onSuccess: async (deletedId: string) => {
      const queryFilter: QueryFilters = {
        queryKey: ["appointments"],
      }

      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<Appointments>(["appointments"], (oldData) => {
        if (!oldData) return undefined

        return {
          ...oldData,
          appointments: oldData.appointments.filter(
            (appointment) => appointment.id !== deletedId,
          ),
        }
      })
    },
    onSettled: async () => {
      if (session.role === "admin") {
        router.push("/admin/appointments")
        router.refresh()
        return
      }
      if (session.role === "agent") {
        router.push("/agent/appointments")
        router.refresh()
        return
      }
      if (session.role === "client") {
        router.push("/appointments")
        router.refresh()
        return
      }
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
