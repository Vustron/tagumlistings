"use server"

// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { Property } from "@/app/(admin)/_components/data/properties"
import type { AddPropertyValues } from "@/lib/validation"

export async function createProperty(data: AddPropertyValues) {
  const URL = "property/create"
  const response = await httpRequest<AddPropertyValues, Property>(URL, "POST", {
    body: data,
  })
  return response
}
