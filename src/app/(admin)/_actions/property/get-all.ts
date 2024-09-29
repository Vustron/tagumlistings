"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { Property } from "@/app/(admin)/_components/data/properties"

export interface Properties {
  properties: Property[]
}

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
