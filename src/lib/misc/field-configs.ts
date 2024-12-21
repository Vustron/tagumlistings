// types
import type {
  LoginValues,
  RegisterValues,
  AddPaymentValues,
  AddPropertyValues,
  NewPasswordValues,
  UpdateAccountValues,
  UpdatePaymentValues,
  ResetPasswordValues,
  UpdatePropertyValues,
  AddAppointmentValues,
} from "@/lib/validation"
import type {
  UserData,
  Property,
  Appointment,
  FieldConfig,
  AppointmentDate,
} from "@/lib/types"

// utils
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
    type: "phone",
    label: "Phone Number",
    placeholder: "0987423213",
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
export const updateAccountFields = (
  isOnClient?: boolean,
): FieldConfig<UpdateAccountValues>[] => [
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
    type: "phone",
    label: "Phone Number",
    placeholder: "0987423213",
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
    isOnClient,
  },
  {
    name: "password",
    type: "password",
    label: "Current Password",
    placeholder: "******",
  },
  {
    name: "newpassword",
    type: "password",
    label: "New Password",
    placeholder: "******",
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirm Password",
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
  {
    name: "price",
    type: "currency",
    label: "Price",
    placeholder: "1,000",
  },
  {
    name: "no_of_bedrooms",
    type: "number",
    label: "Number of Bedrooms",
    placeholder: "1",
  },
  {
    name: "no_of_bathrooms",
    type: "number",
    label: "Number of Bathrooms",
    placeholder: "1",
  },
  {
    name: "square_meter",
    type: "number",
    label: "Square Meter",
    placeholder: "1",
  },
]

// update property form fields
export const updatePropertyFields = (
  accounts: UserData[],
): FieldConfig<UpdatePropertyValues>[] => [
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
  {
    name: "price",
    type: "text",
    label: "Price",
    placeholder: "1,000",
  },
  {
    name: "no_of_bedrooms",
    type: "number",
    label: "Number of Bedrooms",
    placeholder: "1",
  },
  {
    name: "no_of_bathrooms",
    type: "number",
    label: "Number of Bathrooms",
    placeholder: "1",
  },
  {
    name: "square_meter",
    type: "number",
    label: "Square Meter",
    placeholder: "1",
  },
  {
    name: "user",
    type: "select",
    label: "Select a client",
    placeholder: "Select a client",
    options: [
      { value: "N/A", label: "N/A" },
      ...accounts
        .filter((account) => account.id !== undefined)
        .map((account) => ({
          value: account.name,
          label: account.name,
        })),
    ],
  },
  {
    name: "agent",
    type: "select",
    label: "Select the agent",
    placeholder: "Select the agent",
    options: [
      { value: "N/A", label: "N/A" },
      ...accounts
        .filter(
          (account) => account.id !== undefined && account.role === "admin",
        )
        .map((account) => ({
          value: account.name,
          label: account.name,
        })),
    ],
  },
]

// add appointment form fields
export const addAppointmentFields = (
  accounts: UserData[],
  appointmentDates: AppointmentDate[],
  appointments: Appointment[],
  isOnClient?: boolean,
): FieldConfig<AddAppointmentValues>[] => {
  const fields: FieldConfig<AddAppointmentValues>[] = [
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

  if (!isOnClient) {
    fields.unshift({
      name: "user",
      type: "select",
      label: "Select a Client",
      placeholder: "Select a client",
      options: accounts
        .filter((account) => {
          // Check if the user already has an appointment
          const hasAppointment = appointments.some(
            (appointment) => appointment.user === account.name,
          )
          // Only include users who do not have an appointment
          return account.id !== undefined && !hasAppointment
        })
        .map((account) => ({
          value: account.name,
          label: account.name,
        })),
    })
  }

  return fields
}

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
        value: account.name || "",
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

// add payment form fields
export const addPaymentFields = (
  accounts: UserData[],
  appointments: Appointment[],
  properties: Property[],
  property?: string,
): FieldConfig<AddPaymentValues>[] => {
  const fields: FieldConfig<AddPaymentValues>[] = []

  if (!property) {
    fields.push({
      name: "property",
      type: "select",
      label: "Select Property",
      placeholder: "Select property",
      options: properties.map((property) => ({
        value: property.location || "",
        label: property.location || "Unknown location",
      })),
    })
  }

  fields.push(
    {
      name: "user",
      type: "select",
      label: "Select a client",
      placeholder: "Select a client",
      options: accounts
        .filter((account) => account.id !== undefined)
        .map((account) => ({
          value: account.name,
          label: account.name,
        })),
    },
    {
      name: "appointment",
      type: "select",
      label: "Select Appointment",
      placeholder: "Select appointment",
      options: appointments.map((appointment) => ({
        value: appointment.description,
        label: `${appointment.description.substring(0, 20)}`,
      })),
    },
    {
      name: "paid_date",
      type: "date",
      label: "Payment Date",
      placeholder: "Select payment date",
    },
  )

  return fields
}

// update payment form fields
export const updatePaymentFields = (
  accounts: UserData[],
  appointments: Appointment[],
  properties: Property[],
): FieldConfig<UpdatePaymentValues>[] => [
  {
    name: "property",
    type: "select",
    label: "Select Property",
    placeholder: "Select property",
    options: properties.map((property) => ({
      value: property.location || "",
      label: property.location || "Unknown location",
    })),
  },
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
    name: "appointment",
    type: "select",
    label: "Select Appointment",
    placeholder: "Select appointment",
    options: appointments.map((appointment) => ({
      value: appointment.description,
      label: `${appointment.description.substring(0, 20)}`,
    })),
  },
  {
    name: "amount",
    type: "currency",
    label: "Payment Amount",
    placeholder: "Enter amount",
  },
  {
    name: "paid_date",
    type: "date",
    label: "Payment Date",
    placeholder: "Select payment date",
  },
  {
    name: "status",
    type: "select",
    label: "Status",
    placeholder: "Select a status",
    options: [
      { value: "paid", label: "Paid" },
      { value: "pending", label: "Pending" },
      { value: "failed", label: "Failed" },
    ],
  },
]

// new password form fields
export const forgotPasswordFields: FieldConfig<ResetPasswordValues>[] = [
  {
    name: "email",
    type: "email",
    label: "Your verified email",
    placeholder: "jhon@email.com",
  },
]

// new password form fields
export const newPasswordFields: FieldConfig<NewPasswordValues>[] = [
  {
    name: "password",
    type: "password",
    label: "Enter your new password",
    placeholder: "******",
  },
]
