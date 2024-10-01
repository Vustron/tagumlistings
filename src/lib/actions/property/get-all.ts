"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { Properties } from "@/lib/types"

export async function getProperties(): Promise<Properties> {
  const URL = "property/get-all"
  const response = await httpRequest<void, Properties>(URL, "GET")
  return response
}

export async function preFetchProperties() {
  return queryOptions<Properties, Error>({
    queryKey: ["properties"],
    queryFn: () => getProperties(),
  })
}
