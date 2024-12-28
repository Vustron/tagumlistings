"use client"

// actions
import { getProperties } from "@/lib/actions/property/get-all"

// hooks
import { useSuspenseQuery } from "@tanstack/react-query"

// types
import type { Properties } from "@/lib/types"

interface GetPropertiesParams {
  page?: number
  limit?: number
  query?: string
}

export function useGetProperties(): ReturnType<
  typeof useSuspenseQuery<Properties, Error>
>
export function useGetProperties(
  params: GetPropertiesParams,
): ReturnType<typeof useSuspenseQuery<Properties, Error>>
export function useGetProperties(params?: GetPropertiesParams) {
  const queryParams = params
    ? {
        page: params.page && params.page > 0 ? params.page : 1,
        limit: params.limit ?? 9,
        query: params.query ?? "",
      }
    : {
        page: undefined,
        limit: undefined,
        query: "",
      }

  return useSuspenseQuery<Properties, Error>({
    queryKey: params
      ? ["properties", queryParams.page, queryParams.limit, queryParams.query]
      : ["properties"],
    queryFn: () =>
      getProperties(queryParams.page, queryParams.limit, queryParams.query),
  })
}
