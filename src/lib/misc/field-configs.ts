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
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "john",
  },
  {
    name: "address",
    type: "text",
    label: "Address",
    placeholder: "tagum",
  },
  {
    name: "contact_number",
    type: "text",
    label: "Phone Number",
    placeholder: "0987423213",
    isPhone: true,
  },
  {
    name: "email",
    type: "email",
    label: "Email address",
    placeholder: "john@test.com",
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
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "john",
  },
  {
    name: "address",
    type: "text",
    label: "Address",
    placeholder: "tagum",
  },
  {
    name: "contact_number",
    type: "text",
    label: "Phone Number",
    placeholder: "0987423213",
    isPhone: true,
  },
  {
    name: "email",
    type: "email",
    label: "Email address",
    placeholder: "john@test.com",
  },
  {
    name: "role",
    type: "select",
    label: "Role",
    placeholder: "Select role",
    options: [
      { value: "user", label: "User" },
      { value: "admin", label: "Admin" },
    ],
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "******",
  },
  {
    name: "newpassword",
    type: "password",
    label: "New Password",
    placeholder: "******",
  },
]

// login form fields
export const loginFields: FieldConfig<LoginValues>[] = [
  {
    name: "email",
    type: "email",
    label: "Email address",
    placeholder: "john@test.com",
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
