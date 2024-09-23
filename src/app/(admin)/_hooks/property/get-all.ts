// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getProperties } from "@/app/(admin)/_actions/property/get-all"

// types
import type { Properties } from "@/app/(admin)/_actions/property/get-all"

export const useGetProperties = () => {
  return useSuspenseQuery<Properties, Error>({
    queryKey: ["properties"],
    queryFn: () => getProperties(),
  })
}
