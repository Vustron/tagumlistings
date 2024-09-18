// utils
import { z } from "zod"

// required string method
const requiredString = z.string().trim().min(1, "Required")

// signUpSchema
export const registerSchema = z.object({
  name: requiredString,
  address: requiredString,
  contact_number: requiredString,
  email: requiredString.email("Invalid email address"),
  password: requiredString.min(8, "Must be at least 8 characters"),
})

/* RegisterValues Type */
export type RegisterValues = z.infer<typeof registerSchema>

// updateAccountSchema
export const updateAccountSchema = z.object({
  id: requiredString.optional(),
  name: requiredString.optional(),
  address: requiredString.optional(),
  contact_number: requiredString.optional(),
  email: requiredString.email("Invalid email address").optional(),
  role: requiredString.optional(),
  password: requiredString.min(8, "Must be at least 8 characters").optional(),
  newpassword: requiredString
    .min(8, "Must be at least 8 characters")
    .optional(),
})

/* UpdateAccountValues Type */
export type UpdateAccountValues = z.infer<typeof updateAccountSchema>

// loginSchema
export const loginSchema = z.object({
  email: requiredString.email("Invalid email address"),
  password: requiredString,
})

/* loginSchema Type */
export type LoginValues = z.infer<typeof loginSchema>

// addPropertySchema
export const addPropertySchema = z.object({
  category: requiredString,
  location: requiredString,
  status: requiredString,
  propertyPics: z.array(z.string().url("Invalid URL")).optional(),
})

/* postSchema Type */
export type AddPropertyValues = z.infer<typeof addPropertySchema>

// bulkDeleteAccountsSchema
export const bulkDeleteAccountsSchema = z.object({
  ids: z.array(requiredString.or(z.undefined())),
})
/* BulkDeleteAccountValues Type */
export type BulkDeleteAccountValues = z.infer<typeof bulkDeleteAccountsSchema>
