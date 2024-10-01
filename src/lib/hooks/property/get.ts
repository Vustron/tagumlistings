// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getProperty } from "@/lib/actions/property/get"

// types
import type { Property } from "@/lib/types"

export const useGetProperty = (id: string) => {
  return useSuspenseQuery<Property, Error>({
    queryKey: ["property", id],
    queryFn: () => getProperty(id),
  })
}
