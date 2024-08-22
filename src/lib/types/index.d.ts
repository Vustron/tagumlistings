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

// init request config
export type RequestConfig<T> = {
  url: string
  params?: Record<string, string | number | boolean>
  headers?: HeadersInit
  transformResponse?: (data: unknown) => T
}
export interface ErrorResponseData {
  message: string
  statusCode?: number
}

export interface RequestHelloWorld {
  message: string
}

export interface CompatibleRequest extends IncomingMessage {
  headers: Record<string, string | string[]>
}
export type SiteConfig = {
  meta: Metadata
  viewport: Viewport
}

interface FieldConfig<TFieldValues> {
  name: Path<TFieldValues>
  type: string
  label: string
  placeholder: string
  className?: string
}

interface Mutation {
  isPending: boolean
}

interface DynamicFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  onSubmit: SubmitHandler<TFieldValues>
  fields: FieldConfig<TFieldValues>[]
  submitButtonTitle: string
  mutation: Mutation
  className?: string
}

/* Unique Id Type */
export type UniqueId = string
