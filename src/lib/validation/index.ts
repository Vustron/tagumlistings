// utils
import { z } from "zod"

// required string method
const requiredString = z.string().trim().min(1, "Required")

// signUpSchema
export const registerSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ are allowed",
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
})

/* RegisterValues Type */
export type RegisterValues = z.infer<typeof registerSchema>

// loginSchema
export const loginSchema = z.object({
  username: requiredString,
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
