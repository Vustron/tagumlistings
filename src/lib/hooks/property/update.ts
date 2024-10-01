"use client"

// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
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

export const useUpdateProperty = (id?: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-property", id],
    mutationFn: async (values: UpdatePropertyValues) => {
      const sanitizedData = sanitizer<UpdatePropertyValues>(
        values,
        updatePropertySchema,
        purify,
      )
      return await updateProperty(sanitizedData)
    },
    onSuccess: async (updatedProperty) => {
      const propertyQueryFilter: QueryFilters = {
        queryKey: ["property", id],
      }

      const accountsQueryFilter: QueryFilters = {
        queryKey: ["properties"],
      }
      await queryClient.cancelQueries(accountsQueryFilter)

      await queryClient.cancelQueries(propertyQueryFilter)
      queryClient.setQueryData<Property>(["property", id], (oldData) => ({
        ...oldData,
        ...updatedProperty,
      }))

      queryClient.setQueryData<Properties>(["properties"], (oldData) => {
        if (!oldData) return { properties: [updatedProperty] }
        return {
          ...oldData,
          properties: oldData.properties.map((property) =>
            property.id === id ? updatedProperty : property,
          ),
        }
      })
      router.push("/admin/properties")
      router.refresh()
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
