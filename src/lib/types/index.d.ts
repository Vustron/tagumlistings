// types
import type { IncomingMessage } from "node:http"
import type { Metadata, Viewport } from "next"
import type {
  FieldValues,
  Path,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form"

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
interface SelectOption {
  value: string
  label: string
}

/* FieldConfig Type */
interface FieldConfig<TFieldValues> {
  name: Path<TFieldValues>
  type: "text" | "password" | "email" | "number" | "select" | "image" | "switch"
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
