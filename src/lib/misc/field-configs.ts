// types
import type { FieldConfig } from "@/lib/types"
import type {
  AddPropertyValues,
  LoginValues,
  RegisterValues,
  UpdateAccountValues,
} from "@/lib/validation"

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

// register form fields
export const updateAccountFields: FieldConfig<UpdateAccountValues>[] = [
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

// add property form fields
export const addPropertyFields: FieldConfig<AddPropertyValues>[] = [
  {
    name: "propertyPics",
    type: "image",
    label: "Property Image",
    placeholder: "Upload property image",
  },
  {
    name: "category",
    type: "select",
    label: "Category",
    placeholder: "Select a category",
    options: [
      { value: "residential", label: "Residential" },
      { value: "commercial", label: "Commercial" },
      { value: "industrial", label: "Industrial" },
    ],
  },
  {
    name: "location",
    type: "text",
    label: "Location",
    placeholder: "123 street",
  },
  {
    name: "status",
    type: "select",
    label: "Status",
    placeholder: "Select a status",
    options: [
      { value: "available", label: "Available" },
      { value: "sold", label: "Sold" },
      { value: "reserved", label: "Reserved" },
    ],
  },
]
