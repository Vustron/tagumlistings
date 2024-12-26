// utils
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { format, isValid, parseISO } from "date-fns"
import { NextResponse } from "next/server"
import { twMerge } from "tailwind-merge"
import toast from "react-hot-toast"
import superjson from "superjson"
import { ZodError } from "zod"
import { clsx } from "clsx"

// config
import { firebaseStorage } from "@/lib/config/firebase"

// types
import type { AppointmentDate, ErrorResponseData, UniqueId } from "@/lib/types"
import type { SessionData } from "@/lib/config/session"
import type { NextRequest } from "next/server"
import type { Appointment } from "@/lib/types"
import type { ClassValue } from "clsx"
import type DOMPurify from "dompurify"
import type { z } from "zod"

export const filterAvailableDates = (
  dates: AppointmentDate[],
  appointments: Appointment[],
  propertyId?: string,
) => {
  return dates.filter((appointmentDate) => {
    return (
      appointmentDate.dates.filter((date) => {
        const dateMonth = new Date(date).getMonth()
        const dateYear = new Date(date).getFullYear()

        // Check if date is already taken in appointments
        const isDateTaken = appointments.some((appointment) => {
          const appointmentDate = new Date(appointment.date)
          return (
            appointment.propertyId === propertyId &&
            appointmentDate.getMonth() === dateMonth &&
            appointmentDate.getFullYear() === dateYear
          )
        })

        return !isDateTaken
      }).length > 0
    )
  })
}

export const formatDateLocal = (dateString?: string) => {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Utility function to format price to Philippine Peso
export const formatPriceToPHP = (price: string) => {
  const amount = Number.parseFloat(price)
  return amount.toLocaleString("en-PH", { style: "currency", currency: "PHP" })
}

// Utility function to truncate text with ellipsis
export const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`
  }
  return text
}

export const uploadImageToFirebase = async (
  file: File,
  userId: string,
): Promise<string> => {
  try {
    // Check if the file type is allowed
    const allowedExtensions = ["png", "jpg", "jpeg"]
    const fileExtension = file.name.split(".").pop()?.toLowerCase()

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      throw new Error("Only PNG, JPG, and JPEG are allowed.")
    }

    // Check if the file size is within the 1 MB limit
    const maxSize = 1048576
    if (file.size > maxSize) {
      // 1 MB in bytes
      throw new Error("File size must be 1 MB or less.")
    }

    // Create a unique file name to avoid collisions
    const fileName = `${createUniqueId()}.${fileExtension}`

    // Create a reference to the file location
    const storageRef = ref(firebaseStorage, `messages/${userId}/${fileName}`)

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file)

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    throw new Error(`${(error as Error).message}`)
  }
}

export const uploadMultipleImages = async (
  files: File[],
  userId: string,
): Promise<string[]> => {
  try {
    const allowedExtensions = ["png", "jpg", "jpeg"]
    const maxSize = 1048576 // 1 MB in bytes

    const validatedFiles = files.filter((file) => {
      const fileExtension = file.name.split(".").pop()?.toLowerCase()
      return (
        fileExtension &&
        allowedExtensions.includes(fileExtension) &&
        file.size <= maxSize
      )
    })

    if (validatedFiles.length !== files.length) {
      throw new Error(
        "Files must be PNG, JPG, or JPEG and 1 MB or less in size.",
      )
    }

    const uploadPromises = validatedFiles.map((file) =>
      uploadImageToFirebase(file, userId),
    )

    const urls = await Promise.all(uploadPromises)
    return urls
  } catch (error) {
    throw new Error(`${(error as Error).message}`)
  }
}

export const filterAppointmentsForLastHour = (
  appointments: Appointment[],
): Appointment[] => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  return appointments.filter(
    (appointment) => new Date(appointment.date) > oneHourAgo,
  )
}

export const getMonthName = (date: Date) => {
  return date.toLocaleString("default", { month: "long" })
}

export const filterAppointmentsForCurrentMonth = (appointments: any[]) => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date)
    return (
      appointmentDate.getMonth() === currentMonth &&
      appointmentDate.getFullYear() === currentYear
    )
  })
}

// deep search table
export const deepSearch = (obj: any, searchTerm: string): boolean => {
  if (!obj || typeof obj !== "object") return false

  return Object.values(obj).some((value) => {
    if (typeof value === "object") {
      return deepSearch(value, searchTerm)
    }
    if (typeof value === "string" || typeof value === "number") {
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    }
    return false
  })
}

// convert timestamp to date string
export function convertTimestampToDateString(timestamp: {
  seconds: number
  nanoseconds: number
}): string {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000,
  )
  return format(date, "yyyy-MM-dd'T'HH:mm:ssXXX")
}

// is valid session data
export const isValidSessionData = (user: any): user is SessionData => {
  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.address === "string" &&
    typeof user.contact_number === "string" &&
    typeof user.email === "string" &&
    typeof user.role === "string"
  )
}

// get initials
export const getInitials = (name: string) => {
  if (!name) return ""
  const [firstName, lastName] = name.split(" ")
  const firstLetter = firstName ? firstName[0] : ""
  const lastLetter = lastName ? lastName.slice(-1) : firstName?.slice(-1)
  return `${firstLetter}${lastLetter}`.toUpperCase()
}

// helper function to format date
export const formatDate = (date: Date | string): string => {
  if (typeof date === "string") {
    const parsedDate = parseISO(date)
    return isValid(parsedDate)
      ? format(parsedDate, "MM/d/yyyy")
      : "Invalid Date"
  }
  return format(date, "MM/d/yyyy")
}

// change color badge function
export const getPercentageChangeColor = (percentageChange: string) => {
  const value = Number.parseFloat(percentageChange)
  return value >= 0
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400"
}

// helper function to determine badge color based on role
export const getRoleBadgeColor = (role: string) => {
  if (typeof role !== "string") {
    return "bg-gray-100 text-gray-800"
  }

  switch (role.toLowerCase()) {
    case "client":
      return "bg-blue-100 text-blue-800 hover:text-white dark:hover:text-black"
    case "admin":
      return "bg-yellow-100 text-yellow-800 hover:text-white dark:hover:text-black"
    case "agent":
      return "bg-green-100 text-green-800 hover:text-white dark:hover:text-black"
    case "available":
      return "bg-green-100 text-green-800 hover:text-white dark:hover:text-black"
    case "sold":
      return "bg-red-100 text-red-800 hover:text-white dark:hover:text-black"
    case "reserved":
      return "bg-blue-100 text-blue-800 hover:text-white dark:hover:text-black"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// unique Id generator
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

// construct query string utility
export function buildQueryString(
  params?: Record<string, string | number | boolean | undefined>,
): string {
  if (!params) return ""
  return `?${Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`,
    )
    .join("&")}`
}

// client error handler
export function clientErrorHandler(
  error: unknown,
  isToast?: "isToast",
): string {
  const { message }: ErrorResponseData = ErrorHandler.handleError(error)

  if (isToast) {
    toast.error(message)
  }

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
  const serialized = superjson.stringify(data)
  return superjson.parse(serialized)
}
// data sanitizer
export const sanitizer = <T>(
  data: unknown,
  schema: z.ZodObject<z.ZodRawShape>,
  purify: typeof DOMPurify,
): T => {
  // Sanitize each field of the object
  const sanitizeObject = (obj: unknown): unknown => {
    if (obj === null || obj === undefined) return obj

    switch (typeof obj) {
      case "string":
        return purify.sanitize(obj as string)
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
        return obj
    }
  }

  const sanitizedData = sanitizeObject(data)
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
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytes")
      : (sizes[i] ?? "Bytes")
  }`
}

// http error
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = "HttpError"
  }
}

// error class handler
export class ErrorHandler {
  public static handleError(error: unknown): ErrorResponseData {
    if (error instanceof HttpError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
      }
    }

    if (ErrorHandler.isZodError(error)) {
      return ErrorHandler.handleZodError(error)
    }

    if (error instanceof Error) {
      return ErrorHandler.handleGenericError(error)
    }

    return ErrorHandler.handleUnknownError(error)
  }

  private static isZodError(error: unknown): error is ZodError {
    return error instanceof ZodError
  }

  private static handleZodError(error: ZodError): ErrorResponseData {
    const message = error.errors.map((e) => e.message).join(", ")
    return {
      message: `Validation error: ${message}`,
      statusCode: 400,
    }
  }

  private static handleGenericError(error: Error): ErrorResponseData {
    return {
      message: error.message || "An unexpected error occurred.",
      statusCode: 500,
    }
  }

  private static handleUnknownError(error: unknown): ErrorResponseData {
    return {
      message: typeof error === "string" ? error : "An unknown error occurred.",
      statusCode: 500,
    }
  }
}
