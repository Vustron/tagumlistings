// types
import type { FieldConfig } from "@/lib/types"
import type { LoginValues, RegisterValues } from "@/lib/validation"

// register form fields
export const registerFields: FieldConfig<RegisterValues>[] = [
  {
    name: "email",
    type: "email",
    label: "Email address",
    placeholder: "john@test.com",
  },
  {
    name: "username",
    type: "text",
    label: "Username",
    placeholder: "john",
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "******",
  },
]

// login form fields
export const loginFields: FieldConfig<LoginValues>[] = [
  {
    name: "username",
    type: "text",
    label: "Username",
    placeholder: "john",
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "******",
  },
]
