"use client"

// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// actions
import { getProperties } from "@/lib/actions/property/get-all"

// types
import type { Properties } from "@/lib/types"

export const useGetProperties = () => {
  return useSuspenseQuery<Properties, Error>({
    queryKey: ["properties"],
    queryFn: () => getProperties(),
  })
}
