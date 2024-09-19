"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { Property } from "@/app/(admin)/_components/data/properties"

export async function deleteProperty(id: string): Promise<Property[]> {
  const URL = "property/delete"
  const response = await httpRequest<void, Property[]>(URL, "DELETE", {
    params: {
      id,
    },
  })
  return response
}
