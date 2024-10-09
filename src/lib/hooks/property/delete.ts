"use client"

// action
import { deleteProperty } from "@/lib/actions/property/delete"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// utils
import { clientErrorHandler } from "@/lib/utils"

// types
import type { QueryFilters } from "@tanstack/react-query"
import type { Properties } from "@/lib/types"

export const useDeleteProperty = (id: string | undefined) => {
  const router = useRouter()

  // init query client
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-property", id],
    mutationFn: async () => await deleteProperty(id!),
    onSuccess: async () => {
      const queryFilter: QueryFilters = {
        queryKey: ["properties"],
      }

      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<Properties>(["properties"], (oldData) => {
        if (!oldData) return undefined

        return {
          ...oldData,
          properties: oldData.properties.filter(
            (property) => property.id !== id,
          ),
        }
      })
    },
    onSettled: async () => {
      router.push("/admin/properties")
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}