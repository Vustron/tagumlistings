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

/* LoginValues Type */
export type LoginValues = z.infer<typeof loginSchema>

// addPropertySchema
export const addPropertySchema = z.object({
  category: requiredString,
  location: requiredString,
  status: requiredString,
  propertyPics: z
    .array(z.object({ url: z.string().url("Invalid URL") }))
    .optional(),
})

/* AddPropertyValues Type */
export type AddPropertyValues = z.infer<typeof addPropertySchema>

// bulkDeleteAccountsSchema
export const bulkDeleteAccountsSchema = z.object({
  ids: z.array(requiredString.or(z.undefined())),
})
/* BulkDeleteAccountValues Type */
export type BulkDeleteAccountValues = z.infer<typeof bulkDeleteAccountsSchema>

// updatePropertySchema
export const updatePropertySchema = z.object({
  id: requiredString.optional(),
  category: requiredString.optional(),
  location: requiredString.optional(),
  status: requiredString.optional(),
  propertyPics: z
    .array(z.object({ url: z.string().url("Invalid URL") }))
    .optional(),
})

/* UpdatePropertyValues Type */
export type UpdatePropertyValues = z.infer<typeof updatePropertySchema>

// bulkDeleteAccountsSchema
export const bulkDeletePropertiesSchema = z.object({
  ids: z.array(requiredString.or(z.undefined())),
})
/* BulkDeleteAccountValues Type */
export type BulkDeletePropertiesValues = z.infer<
  typeof bulkDeletePropertiesSchema
>

// addAppointmentSchema
export const addAppointmentSchema = z.object({
  user: requiredString.optional(),
  date: requiredString.optional(),
  description: requiredString.optional(),
  color: requiredString.optional(),
})

/* AddAppointmentValues Type */
export type AddAppointmentValues = z.infer<typeof addAppointmentSchema>

// addAppointmentSchema
export const addAppointmentDateSchema = z.object({
  id: requiredString.optional(),
  dates: z.array(z.date()),
})

/* AddAppointmentValues Type */
export type AddAppointmentDateValues = z.infer<typeof addAppointmentDateSchema>

// addAppointmentSchema
export const deleteAppointmentDateSchema = z.object({
  id: requiredString.optional(),
})

/* deleteAppointmentDateSchema Type */
export type DeleteAppointmentDateValues = z.infer<
  typeof deleteAppointmentDateSchema
>
