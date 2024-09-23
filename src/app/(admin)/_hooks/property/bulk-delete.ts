"use client"

// actions
import { deleteProperties } from "@/app/(admin)/_actions/property/bulk-delete"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import DOMPurify from "dompurify"

// validation
import { bulkDeletePropertiesSchema } from "@/lib/validation"

// types
import type { Properties } from "@/app/(admin)/_actions/property/get-all"
import type { BulkDeletePropertiesValues } from "@/lib/validation"
import type { QueryFilters } from "@tanstack/react-query"

const purify = DOMPurify

export const useDeleteProperties = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["bulk-delete-properties"],
    mutationFn: async (ids: BulkDeletePropertiesValues) => {
      const sanitizedData = sanitizer<BulkDeletePropertiesValues>(
        ids,
        bulkDeletePropertiesSchema,
        purify,
      )

      const filteredIds = (sanitizedData.ids || []).filter(
        (id): id is string => id !== undefined,
      )

      const bodyData = {
        ids: filteredIds,
      }

      return await deleteProperties(bodyData)
    },
    onSuccess: async (_, variables) => {
      const queryFilter: QueryFilters = {
        queryKey: ["properties"],
      }

      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<Properties>(["properties"], (oldData) => {
        if (!oldData) return undefined

        const deletedIds = new Set(variables.ids)

        return {
          ...oldData,
          appointments: oldData.appointments.filter(
            (property) => !deletedIds.has(property.id),
          ),
        }
      })
    },

    onSettled: () => {
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
