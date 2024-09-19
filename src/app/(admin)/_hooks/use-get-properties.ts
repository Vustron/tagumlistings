// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getProperties } from "@/app/(admin)/_actions/get-properties"

// types
import type { Properties } from "@/app/(admin)/_actions/get-properties"

export const useGetProperties = () => {
  return useSuspenseQuery<Properties, Error>({
    queryKey: ["properties"],
    queryFn: () => getProperties(),
  })
}
