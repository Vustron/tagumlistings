"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { Property } from "@/app/(admin)/_components/data/properties"
import type { UpdatePropertyValues } from "@/lib/validation"

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
