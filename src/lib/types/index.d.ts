// components
import { PaletteIcon, PresentationIcon, StoreIcon } from "lucide-react"

// types
import type {
  Path,
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form"
import type { IncomingMessage } from "node:http"
import type { Metadata, Viewport } from "next"
import type { FC } from "react"

/* --------------HTTP Requests Types---------------- */

/* Compatible Request Type */
export interface CompatibleRequest extends IncomingMessage {
  headers: Record<string, string | string[]>
}

// init request config
export type RequestConfig<T> = {
  url?: string
  params?: Record<string, string | number | boolean>
  headers?: HeadersInit
  transformResponse?: (data: unknown) => T
  customURL?: string
}

/* ErrorResponseData Type */
export interface ErrorResponseData {
  message: string
  statusCode?: number
}

/* CompatibleRequest Type */
export interface CompatibleRequest extends IncomingMessage {
  headers: Record<string, string | string[]>
}

/* SiteConfig Type */
export type SiteConfig = {
  meta: Metadata
  viewport: Viewport
}

/* --------------Components Types---------------- */

/* SelectOption Type */
interface SelectOption<T = string> {
  value: T
  label: string
}

/* FieldConfig Type */
interface FieldConfig<TFieldValues> {
  name: Path<TFieldValues>
  type:
    | "text"
    | "password"
    | "email"
    | "number"
    | "select"
    | "image"
    | "switch"
    | "date"
    | "color"
    | "currency"
  label: string
  placeholder?: string
  className?: string
  accept?: "image/*"
  options?: SelectOption[]
  isPhone?: boolean
  multiple?: boolean
}

/* Mutation Type */
interface Mutation {
  isPending: boolean
}

/* DynamicFormProps Type */
interface DynamicFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  onSubmit: SubmitHandler<TFieldValues>
  fields: FieldConfig<TFieldValues>[]
  submitButtonTitle: string
  mutation?: Mutation
  className?: string
  disabled?: boolean
  submitButtonClassname?: string
  submitButtonTitleClassname?: string
  cloudinaryCloudName?: string
  cloudinaryUploadPreset?: string
  imagekitConfig?: {
    publicKey: string
    urlEndpoint: string
    authenticationEndpoint: string
  }
}

/* Unique Id Type */
export type UniqueId = string

/* UserData Type */
export interface UserData {
  id?: string
  name: string
  address: string
  contact_number: string
  email: string
  role: string
  password?: string
  loggedIn?: boolean
  createdAt?: string
  updatedAt?: string
}

/* Accounts Type */
export interface Accounts {
  accounts: UserData[]
}

/* Client Type */
export interface Client {
  id: string
  name: string
  email: string
  messages: {
    id: string
    content: string
    senderId: string
    timestamp: number
  }[]
}

export const clients: Client[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    messages: [
      {
        id: "1",
        content: "Hello, I have a question about my account.",
        timestamp: Date.now() - 3600000,
        senderId: "1",
      },
      {
        id: "2",
        content: "Hi John, I'd be happy to help. What's your question?",
        timestamp: Date.now() - 3540000,
        senderId: "admin",
      },
      {
        id: "3",
        content:
          "I can't seem to update my billing information. Can you assist?",
        timestamp: Date.now() - 3480000,
        senderId: "1",
      },
      {
        id: "4",
        content:
          "Of course! I can guide you through the process. First, can you tell me which part you're having trouble with?",
        timestamp: Date.now() - 3420000,
        senderId: "admin",
      },
      {
        id: "5",
        content:
          "When I try to save my new credit card details, I get an error message.",
        timestamp: Date.now() - 3360000,
        senderId: "1",
      },
      {
        id: "6",
        content:
          "I see. Can you provide the exact error message you're seeing?",
        timestamp: Date.now() - 3300000,
        senderId: "admin",
      },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    messages: [
      {
        id: "7",
        content: "Hi, I'm having issues with my recent order #12345.",
        timestamp: Date.now() - 7200000,
        senderId: "2",
      },
      {
        id: "8",
        content:
          "Hello Jane, I'm sorry to hear that. Can you please provide more details about the issue?",
        timestamp: Date.now() - 7140000,
        senderId: "admin",
      },
      {
        id: "9",
        content: "The package arrived, but one item is missing.",
        timestamp: Date.now() - 7080000,
        senderId: "2",
      },
      {
        id: "10",
        content:
          "I apologize for the inconvenience. Let me check your order details. Which item is missing?",
        timestamp: Date.now() - 7020000,
        senderId: "admin",
      },
      {
        id: "11",
        content: "The red t-shirt in size medium is not in the package.",
        timestamp: Date.now() - 6960000,
        senderId: "2",
      },
      {
        id: "12",
        content:
          "Thank you for the information. I'll look into this right away and get back to you with a solution.",
        timestamp: Date.now() - 6900000,
        senderId: "admin",
      },
    ],
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    messages: [
      {
        id: "13",
        content: "Good morning! I'm interested in upgrading my subscription.",
        timestamp: Date.now() - 86400000,
        senderId: "3",
      },
      {
        id: "14",
        content:
          "Good morning Alice! That's great to hear. Which plan are you currently on, and which one are you considering?",
        timestamp: Date.now() - 86340000,
        senderId: "admin",
      },
      {
        id: "15",
        content:
          "I'm on the basic plan, and I'm thinking about the premium plan.",
        timestamp: Date.now() - 86280000,
        senderId: "3",
      },
      {
        id: "16",
        content:
          "Excellent choice! The premium plan offers several additional features. Would you like me to go over the benefits?",
        timestamp: Date.now() - 86220000,
        senderId: "admin",
      },
      {
        id: "17",
        content:
          "Yes, please. I'm particularly interested in the advanced reporting features.",
        timestamp: Date.now() - 86160000,
        senderId: "3",
      },
      {
        id: "18",
        content:
          "Of course! The premium plan includes real-time analytics, custom report builders, and data export options. Let me explain each in detail...",
        timestamp: Date.now() - 86100000,
        senderId: "admin",
      },
    ],
  },
]

/* Payment Type */
export interface Payment {
  id: string
  property: string
  user: string
  appointment: string
  amount: string
  paid_date: string
}

/* Payments Type */
export interface Payments {
  payments: Payment[]
}

/* Property Type */
export interface Property {
  id?: string
  category?: string
  location?: string
  status?: string
  user_id?: string
  appointment_id?: string | null
  propertyPics?: { url: string }[]
  created_at?: string
  updated_at?: string
}

/* Properties Type */
export interface Properties {
  properties: Property[]
}

/* User Type */
export interface User {
  id: string
  name: string
  username: string
  email: string
  role: string
  created_at?: string
  updated_at?: string
}

/* Appointment Type */
export type Appointment = Omit<Event, "id"> & {
  id?: string
  user: string
  date: Date
  description: string
  color: string
}

/* Appointments Type */
export interface Appointments {
  appointments: Appointment[]
}

/* AppointmentDate Type */
export interface AppointmentDate {
  id?: string | undefined
  dates: Date[]
}

/* AppointmentDates Type */
export interface AppointmentDates {
  dates: AppointmentDate[]
}

/* AppointmentDates Type */
interface ImageKitAuthProps {
  signature: string
  expire: string
  token: string
}

/* AppointmentDates Type */
export type ServiceCardsData = {
  title: string
  description: string
  Icon: FC<{ className?: string }>
}

/* AppointmentDates Type */
export const serviceCardsData: ServiceCardsData[] = [
  {
    title: "Build your portfolio",
    description: "The simplest way to keep your portfolio always up-to-date.",
    Icon: PaletteIcon,
  },
  {
    title: "Get freelance work",
    description: "New design projects delivered to your inbox each morning.",
    Icon: PresentationIcon,
  },
  {
    title: "Sell your goods",
    description:
      "Get your goods in front of millions of potential customers with ease.",
    Icon: StoreIcon,
  },
  // Add more card data as needed
]

/* PropertyType Type */
export type PropertyType = "House" | "Apartment" | "Land" | "Commercial"

/* Filter Type */
export interface Filter {
  types: PropertyType[]
  minPrice: number
  maxPrice: number
}
