// utils
import { z } from "zod"

// required string method
const requiredString = z.string().trim().min(1, "Required").max(255)

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

const propertySchema = z.object({
  id: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  status: z.string().optional(),
  user_id: z.string().optional(),
  appointment_id: z.string().nullable().optional(),
  propertyPics: z.array(z.object({ url: z.string() })).optional(),
  no_of_bedrooms: z.string().optional(),
  no_of_bathrooms: z.string().optional(),
  square_meter: z.string().optional(),
  user: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

// updateAccountSchema
export const updateAccountSchema = z
  .object({
    id: requiredString.optional(),
    name: requiredString.optional(),
    address: requiredString.optional(),
    contact_number: requiredString.optional(),
    email: requiredString.email("Invalid email address").optional(),
    role: requiredString.optional(),
    password: requiredString.min(8, "Must be at least 8 characters").optional(),
    confirmPassword: requiredString
      .min(8, "Must be at least 8 characters")
      .optional(),
    newpassword: requiredString
      .min(8, "Must be at least 8 characters")
      .optional(),
    reservedProperties: z.array(propertySchema).optional(),
  })
  .refine(
    (data) => {
      if (data.newpassword && data.confirmPassword) {
        return data.newpassword === data.confirmPassword
      }
      return true
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  )

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
  category: requiredString.optional(),
  location: requiredString.optional(),
  status: requiredString.optional(),
  propertyPics: z
    .array(z.object({ url: z.string().url("Invalid URL") }))
    .optional(),
  price: requiredString.optional(),
  no_of_bedrooms: requiredString.optional(),
  no_of_bathrooms: requiredString.optional(),
  square_meter: requiredString.optional(),
  payment: requiredString.optional(),
  user: requiredString.optional(),
  appointment: requiredString.optional(),
  amount: requiredString.optional(),
  paid_date: requiredString.optional(),
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
  price: requiredString.optional(),
  no_of_bedrooms: requiredString.optional(),
  no_of_bathrooms: requiredString.optional(),
  square_meter: requiredString.optional(),
  user: z.string().trim().max(255).optional(),
  appointment_id: requiredString.optional(),
  payment: requiredString.optional(),
  appointment: requiredString.optional(),
  amount: requiredString.optional(),
  paid_date: requiredString.optional(),
  agent: requiredString.optional(),
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
  status: requiredString.optional(),
  propertyId: requiredString.optional(),
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

// updateAppointmentSchema
export const updateAppointmentSchema = z.object({
  id: requiredString.optional(),
  user: requiredString.optional(),
  date: requiredString.optional(),
  description: requiredString.optional(),
  color: requiredString.optional(),
  status: requiredString.optional(),
  propertyId: requiredString.optional(),
})

/* UpdateAppointmentValues Type */
export type UpdateAppointmentValues = z.infer<typeof updateAppointmentSchema>

// addAppointmentSchema
export const addPaymentSchema = z.object({
  property: requiredString.optional(),
  propertyId: requiredString.optional(),
  user: requiredString.optional(),
  appointment: requiredString.optional(),
  amount: requiredString,
  paid_date: requiredString,
  status: requiredString.nullish(),
})

/* AddAppointmentValues Type */
export type AddPaymentValues = z.infer<typeof addPaymentSchema>

// updatePaymentSchema
export const updatePaymentSchema = z.object({
  id: requiredString.optional(),
  property: requiredString.optional(),
  propertyId: requiredString.optional(),
  user: requiredString.optional(),
  appointment: requiredString.optional(),
  amount: requiredString.optional(),
  paid_date: requiredString.optional(),
  status: requiredString.nullish(),
})

/* UpdatePaymentValues Type */
export type UpdatePaymentValues = z.infer<typeof updatePaymentSchema>

// bulkDeletePaymentsSchema
export const bulkDeletePaymentsSchema = z.object({
  ids: z.array(requiredString.or(z.undefined())),
})
/* BulkDeleteAccountValues Type */
export type BulkDeletePaymentsValues = z.infer<typeof bulkDeletePaymentsSchema>

// newPasswordSchema
export const newPasswordSchema = z.object({
  token: requiredString.nullable(),
  password: requiredString,
})
/* NewPasswordValues Type */
export type NewPasswordValues = z.infer<typeof newPasswordSchema>

// resetPasswordEmailSchema
export const resetPasswordEmailSchema = z.object({
  email: requiredString.email({ message: "Invalid email address" }),
})
/* ResetPasswordValues Type */
export type ResetPasswordValues = z.infer<typeof resetPasswordEmailSchema>

// reservePropertySchema
export const reservePropertySchema = z.object({
  propertyId: requiredString,
})

/* ReservePropertyValues Type */
export type ReservePropertyValues = z.infer<typeof addPropertySchema>

// createMessageSchema
export const createMessageSchema = z.object({
  id: requiredString.optional(),
  content: requiredString.optional(),
  images: z.array(requiredString.optional()),
  senderId: requiredString.optional(),
  receiverId: requiredString.optional(),
  seen: z.boolean().optional(),
})

/* AddMessageValues Type */
export type AddMessageValues = z.infer<typeof createMessageSchema>
