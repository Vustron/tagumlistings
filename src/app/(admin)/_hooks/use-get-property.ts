// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getProperty } from "@/app/(admin)/_actions/get-property"

// types
import type { Property } from "@/app/(admin)/_components/data/properties"

export const useGetProperty = (id: string) => {
  return useSuspenseQuery<Property, Error>({
    queryKey: ["property", id],
    queryFn: () => getProperty(id),
  })
}
