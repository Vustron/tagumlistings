// utils
import { clsx } from "clsx"
import { NextResponse } from "next/server"
import toast from "react-hot-toast"
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod"

// types
import type { ErrorResponseData, UniqueId } from "@/lib/types"
import type { ClassValue } from "clsx"
import type DOMPurify from "dompurify"
import type { NextRequest } from "next/server"
import type { z } from "zod"

// Helper function to format date
export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })
}

// change color badge function
export const getPercentageChangeColor = (percentageChange: string) => {
  const value = Number.parseFloat(percentageChange)
  return value >= 0
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400"
}

// Helper function to determine badge color based on role
export const getRoleBadgeColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "client":
      return "bg-blue-100 text-blue-800 hover:text-white dark:hover:text-black"
    case "admin":
      return "bg-green-100 text-green-800 hover:text-white dark:hover:text-black"
    case "sold":
      return "bg-green-100 text-green-800 hover:text-white dark:hover:text-black"
    case "reserved":
      return "bg-blue-100 text-blue-800 hover:text-white dark:hover:text-black"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Unique Id generator
export function createUniqueId(
  length: number = 21,
  alphabet: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_",
): UniqueId {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }
  return result
}

// Construct query string utility
export function buildQueryString(
  params?: Record<string, string | number | boolean>,
): string {
  if (!params) return ""
  return `?${Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&")}`
}

// client error handler
export function clientErrorHandler(error: unknown, isToast?: "isToast") {
  // init error handler
  const { message }: ErrorResponseData = ErrorHandler.handleError(error)

  if (isToast) {
    toast.error(message)
  }
  // return error message as string
  return message
}

// placeholder image
export const placeholderImage = (str: string) => {
  return `https://placehold.co/400x600/EEE/31343C?font=montserrat&text=${encodeURI(
    str,
  )}`
}

// parse json data
export function requestBodyHandler<T>(request: NextRequest): Promise<T> {
  return request.json() as Promise<T>
}

// check required fields
export function checkRequiredFields<T>(
  body: T,
  requiredFields: (keyof T)[],
): NextResponse | null {
  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `${String(field)} is missing` },
        { status: 400 },
      )
    }
  }
  return null
}

// response stringify parser
export const dataSerializer = <T>(data: T): T => {
  // serialize data
  const serializedData = JSON.stringify(data).toString()
  return JSON.parse(serializedData) as T
}

// data sanitizer
export const sanitizer = <T>(
  data: unknown,
  schema: z.ZodObject<z.ZodRawShape>,
  purify: DOMPurify.DOMPurifyI,
): T => {
  // Sanitize each field of the object
  const sanitizeObject = (obj: unknown): unknown => {
    if (obj === null || obj === undefined) return obj

    switch (typeof obj) {
      case "string":
        return purify.sanitize(obj)
      case "object":
        if (Array.isArray(obj)) {
          return obj.map((item) => sanitizeObject(item))
        }
        return Object.keys(obj).reduce(
          (acc, key) => {
            acc[key] = sanitizeObject((obj as Record<string, unknown>)[key])
            return acc
          },
          {} as Record<string, unknown>,
        )
      default:
        return obj // leave non-string fields unchanged
    }
  }

  // Sanitize the data
  const sanitizedData = sanitizeObject(data)

  // Validate and parse the object
  const parsedData = schema.safeParse(sanitizedData)

  if (!parsedData.success) {
    throw new Error(JSON.stringify(parsedData.error.errors))
  }

  return parsedData.data as T
}

// class name merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// bytes formatter
export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: "accurate" | "normal"
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytes" : sizes[i] ?? "Bytes"
  }`
}

// error class handler
export class ErrorHandler {
  // init error handler method
  public static handleError(error: unknown): ErrorResponseData {
    // return fetch error if fetch error
    if (ErrorHandler.isFetchError(error)) {
      return ErrorHandler.handleFetchError(error)
    }

    // return zod error if zod error
    if (ErrorHandler.isZodError(error)) {
      return ErrorHandler.handleZodError(error)
    }

    // return generic if generic error
    if (error instanceof Error) {
      return ErrorHandler.handleGenericError(error)
    }

    // return unknown error if unknown error
    return ErrorHandler.handleUnknownError(error)
  }

  // init fetch error identifier method
  private static isFetchError(
    error: unknown,
  ): error is { status: number; error: string } {
    return (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      "error" in error
    )
  }

  // init zod error identifier method
  private static isZodError(error: unknown): error is ZodError {
    return error instanceof ZodError
  }

  // init fetch error handler method
  private static handleFetchError(error: {
    status: number
    error: string
  }): ErrorResponseData {
    return {
      message: error.error || "A network error occurred.",
      statusCode: error.status || 500,
    }
  }

  // init zod error handler method
  private static handleZodError(error: ZodError): ErrorResponseData {
    // init message
    const message = error.errors.map((e) => e.message).join(", ")
    return {
      message: `Validation error: ${message}`,
      statusCode: 400,
    }
  }

  // init generic error handler method
  private static handleGenericError(error: Error): ErrorResponseData {
    return {
      message: error.message || "An unexpected error occurred.",
      statusCode: 500,
    }
  }

  // init unknown error handler method
  private static handleUnknownError(error: unknown): ErrorResponseData {
    return {
      message: typeof error === "string" ? error : "An unknown error occurred.",
      statusCode: 500,
    }
  }
}
