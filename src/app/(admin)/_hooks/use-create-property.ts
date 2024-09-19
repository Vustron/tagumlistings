// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// actions
import { createProperty } from "@/app/(admin)/_actions/create-property"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { addPropertySchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { Properties } from "@/app/(admin)/_actions/get-properties"
import type { AddPropertyValues } from "@/lib/validation"
import type { QueryFilters } from "@tanstack/react-query"

const purify = DOMPurify

export const useCreateProperty = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: ["create-property"],
    mutationFn: async (values: AddPropertyValues) => {
      const sanitizedData = sanitizer<AddPropertyValues>(
        values,
        addPropertySchema,
        purify,
      )
      return await createProperty(sanitizedData)
    },
    onSuccess: async (newProperty) => {
      const queryFilter: QueryFilters = {
        queryKey: ["properties"],
      }

      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<Properties>(["properties"], (oldData) => {
        if (!oldData) {
          return { properties: [newProperty] }
        }
        return {
          ...oldData,
          properties: [...oldData.properties, newProperty],
        }
      })
    },
    onSettled: () => {
      router.push("/admin/properties")
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
