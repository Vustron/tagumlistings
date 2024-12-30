// configs
import { httpRequest } from "@/lib/config/http"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { QueryClient } from "@tanstack/react-query"
import type { Properties } from "@/lib/types"

export async function getProperties(
  page?: number,
  limit?: number,
  query?: string,
): Promise<Properties> {
  const URL = "property/get-all"

  const params: { page?: number; limit?: number; query?: string } = {}

  if (page !== undefined) params.page = page
  if (limit !== undefined) params.limit = limit
  if (query) params.query = query

  const response = await httpRequest<void, Properties>(URL, "GET", {
    params: Object.keys(params).length > 0 ? params : undefined,
  })

  return response
}

export async function preFetchProperties() {
  return async (_queryClient: QueryClient) => {
    return queryOptions<Properties, Error>({
      queryKey: ["properties"],
      queryFn: () => getProperties(),
    })
  }
}
