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

/* RequestConfig Type */
export type RequestConfig<T> = {
  url: string
  params?: Record<string, string | number | boolean>
  headers?: HeadersInit
  transformResponse?: (data: unknown) => T
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
  type: "text" | "password" | "email" | "number" | "select" | "image"
  label: string
  placeholder: string
  className?: string
  options?: SelectOption[]
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
}

/* Unique Id Type */
export type UniqueId = string
