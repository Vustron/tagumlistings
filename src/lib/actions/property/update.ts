"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { UpdatePropertyValues } from "@/lib/validation"
import type { Property } from "@/lib/types"

export async function updateProperty(propertyData: UpdatePropertyValues) {
  const URL = "property/update"
  const response = await httpRequest<UpdatePropertyValues, Property>(
    URL,
    "PATCH",
    {
      body: propertyData,
    },
  )
  return response
}
