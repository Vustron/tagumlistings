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
  digest?: string
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
  value: T | undefined
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
    | "phone"
  label: string
  placeholder?: string
  className?: string
  accept?: "image/*"
  options?: SelectOption[]
  isPhone?: boolean
  multiple?: boolean
  isOnClient?: boolean
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
  isSignIn?: boolean
  isSignUp?: boolean
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
  messages?: Message[]
  loggedIn?: boolean
  reservedProperties?: Property[]
  createdAt?: string
  updatedAt?: string
}

/* Message Type */
export interface Message {
  id?: string
  senderId?: string
  receiverId?: string
  content?: string
  images?: string[]
  seen?: boolean
  createdAt?: string
  updatedAt?: string
}

/* Messages Type */
export interface Messages {
  messages: Message[]
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

/* Payment Type */
export interface Payment {
  id: string
  property: string
  user: string
  appointment: string
  amount: string
  paid_date: string
  status?: string | null
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
  user?: string
  price?: string
  appointment_id?: string | null
  propertyPics?: { url: string }[]
  no_of_bedrooms?: string
  no_of_bathrooms?: string
  square_meter?: string
  payments?: Payment[]
  agent?: string
  created_at?: string
  updated_at?: string | FieldValue
}

export interface PaginationMetadata {
  total: number
  page: number
  limit: number
  totalPages: number
}

/* Properties Type */
export interface Properties {
  properties: Property[]
  pagination?: PaginationMetadata
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
  status?: string
  propertyId?: string
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

/* ImageKitAuthProps Type */
interface ImageKitAuthProps {
  signature: string
  expire: string
  token: string
}

/* ServiceCardsData Type */
export type ServiceCardsData = {
  title: string
  description: string
  Icon: FC<{ className?: string }>
}

/* PropertyType Type */
export type PropertyType = "House" | "Apartment" | "Land" | "Commercial"

/* Filter Type */
export interface Filter {
  category?: string
  location?: string
  status?: string
}

/* Filter Type */
export interface ErrorDetail {
  message: string
  digest?: string
}

/* QueryKeys Type */
export type QueryKeys = {
  account: (id: string) => ["account", string]
  accounts: () => ["accounts"]
  properties: () => ["properties"]
  property: (id: string) => ["property", string]
  appointments: () => ["appointments"]
  appointmentDates: () => ["appointment-dates"]
  appointment: (id: string) => ["appointment", string]
  payments: () => ["payments"]
  payment: (id: string) => ["payment", string]
  messages: () => ["messages"]
}

/* RouteConfig Type */
export type RouteConfig = {
  pathname: string
  prefetchFns: Array<() => Promise<unknown>>
}

/* Request Password API Type */
export interface RequestResetPassword {
  token: string | null
  password: string
}

/* Reset Data Type */
export interface ResetPasswordData {
  resetPasswordToken?: string
  email?: string
}

/* Request Password API Type */
export interface RequestResetPassword {
  token: string | null
  password: string
}
