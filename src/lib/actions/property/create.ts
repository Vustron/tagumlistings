// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { AddPropertyValues } from "@/lib/validation"
import type { Property } from "@/lib/types"

export async function createProperty(data: AddPropertyValues) {
  const URL = "property/create"
  const response = await httpRequest<AddPropertyValues, Property>(URL, "POST", {
    body: data,
  })
  return response
}
