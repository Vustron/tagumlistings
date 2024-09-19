"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// utils
import { queryOptions } from "@tanstack/react-query"

// types
import type { Property } from "@/app/(admin)/_components/data/properties"

export async function getProperty(id: string): Promise<Property> {
  const URL = "property/get"
  const response = await httpRequest<{ id: string }, Property>(URL, "GET", {
    params: {
      id,
    },
  })
  return response
}

export async function preFetchProperties(id: string) {
  return queryOptions<Property, Error>({
    enabled: !!id,
    queryKey: ["property", id],
    queryFn: () => getProperty(id),
  })
}
