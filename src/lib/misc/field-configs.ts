// types
import type {
  AddPropertyValues,
  LoginValues,
  RegisterValues,
  UpdateAccountValues,
  UpdatePropertyValues,
  AddAppointmentValues,
} from "@/lib/validation"
import type { AppointmentDate } from "@/app/(admin)/_components/appointments/date"
import type { FieldConfig, UserData } from "@/lib/types"
import { format } from "date-fns"

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

// update account form fields
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
    type: "switch",
    label: "Role",
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
    label: "Property Images",
    placeholder: "Upload property images",
    accept: "image/*",
    multiple: true,
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

// update property form fields
export const updatePropertyFields: FieldConfig<UpdatePropertyValues>[] = [
  {
    name: "propertyPics",
    type: "image",
    label: "Property Images",
    placeholder: "Upload property images",
    accept: "image/*",
    multiple: true,
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

// add appointment form fields
export const addAppointmentFields = (
  accounts: UserData[],
  appointmentDates: AppointmentDate[],
): FieldConfig<AddAppointmentValues>[] => [
  {
    name: "user",
    type: "select",
    label: "Select a Client",
    placeholder: "Select a client",
    options: accounts
      .filter((account) => account.id !== undefined)
      .map((account) => ({
        value: account.name,
        label: account.name,
      })),
  },
  {
    name: "date",
    type: "select",
    label: "Select Appointment Date",
    placeholder: "Select appointment date",
    options: appointmentDates.map((appointmentDate) => ({
      value: appointmentDate.dates?.[0]
        ? appointmentDate.dates[0].toString()
        : "",
      label: appointmentDate.dates?.[0]
        ? format(new Date(appointmentDate.dates[0]), "yyyy-MM-dd")
        : "",
    })),
  },
  {
    name: "description",
    type: "text",
    label: "Appointment Description",
    placeholder: "Enter description",
  },
  {
    name: "color",
    type: "color",
    label: "Color",
    placeholder: "Select color",
  },
]

// update appointment form fields
export const updateAppointmentFields = (
  accounts: UserData[],
  appointmentDates: AppointmentDate[],
): FieldConfig<AddAppointmentValues>[] => [
  {
    name: "user",
    type: "select",
    label: "Select a Client",
    placeholder: "Select a client",
    options: accounts
      .filter((account) => account.id !== undefined)
      .map((account) => ({
        value: account.name,
        label: account.name,
      })),
  },
  {
    name: "date",
    type: "select",
    label: "Select Appointment Date",
    placeholder: "Select appointment date",
    options: appointmentDates.map((appointmentDate) => ({
      value: appointmentDate.dates?.[0]
        ? appointmentDate.dates[0].toString()
        : "",
      label: appointmentDate.dates?.[0]
        ? format(new Date(appointmentDate.dates[0]), "yyyy-MM-dd")
        : "",
    })),
  },
  {
    name: "description",
    type: "text",
    label: "Appointment Description",
    placeholder: "Enter description",
  },
  {
    name: "color",
    type: "color",
    label: "Color",
    placeholder: "Select color",
  },
]
