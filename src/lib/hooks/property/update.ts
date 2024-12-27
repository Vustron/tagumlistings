"use client"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/components/providers/session"
import { useRouter } from "next-nprogress-bar"

// actions
import { updateProperty } from "@/lib/actions/property/update"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { updatePropertySchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { UpdatePropertyValues } from "@/lib/validation"
import type { QueryFilters } from "@tanstack/react-query"
import type { Property, Properties } from "@/lib/types"

const purify = DOMPurify

export const useUpdateProperty = (idOrIds?: string | string[]) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const session = useSession()

  return useMutation({
    mutationKey: ["update-property", idOrIds],
    mutationFn: async (
      values: UpdatePropertyValues | UpdatePropertyValues[],
    ) => {
      const sanitizedData = sanitizer<
        UpdatePropertyValues | UpdatePropertyValues[]
      >(values, updatePropertySchema, purify)
      return await updateProperty(sanitizedData)
    },
    onSuccess: async (updatedProperty) => {
      const propertyQueryFilter: QueryFilters = {
        queryKey: ["property", idOrIds],
      }

      const accountsQueryFilter: QueryFilters = {
        queryKey: ["properties"],
      }

      await queryClient.cancelQueries(accountsQueryFilter)
      await queryClient.cancelQueries(propertyQueryFilter)

      if (Array.isArray(updatedProperty)) {
        for (const property of updatedProperty) {
          queryClient.setQueryData<Property>(
            ["property", property.id],
            (oldData) => ({
              ...oldData,
              ...property,
            }),
          )
        }

        queryClient.setQueryData<Properties>(["properties"], (oldData) => {
          if (!oldData) return { properties: updatedProperty }
          return {
            ...oldData,
            properties: oldData.properties.map(
              (property) =>
                updatedProperty.find((p) => p.id === property.id) || property,
            ),
          }
        })
      } else {
        // Single update
        queryClient.setQueryData<Property>(
          ["property", idOrIds],
          (oldData) => ({
            ...oldData,
            ...updatedProperty,
          }),
        )

        queryClient.setQueryData<Properties>(["properties"], (oldData) => {
          if (!oldData) return { properties: [updatedProperty] }
          return {
            ...oldData,
            properties: oldData.properties.map((property) =>
              property.id === idOrIds ? updatedProperty : property,
            ),
          }
        })
      }
      if (session.role === "agent") {
        router.push("/agent/properties")
        router.refresh()
      }
      router.push("/admin/properties")
      router.refresh()
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
