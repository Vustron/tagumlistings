// utils
import { env } from "@/lib/config/env.mjs"
import { buildQueryString, clientErrorHandler } from "@/lib/utils"

// Updated RequestConfig type
export type RequestConfig<RequestType = any, ResponseType = any> = {
  url?: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  params?: Record<string, string | number | boolean>
  headers?: HeadersInit
  body?: RequestType
  transformResponse?: (data: unknown) => ResponseType
  customURL?: string
}

export async function httpRequest<RequestType = any, ResponseType = any>({
  url,
  method,
  params,
  headers = {},
  body,
  transformResponse,
  customURL,
}: RequestConfig<RequestType, ResponseType>): Promise<ResponseType> {
  try {
    // Full URL with query string
    const fullUrl = `${env.NEXT_PUBLIC_APP_URL}/api/v1/${url}${buildQueryString(params)}`

    // Use customURL if provided, otherwise use fullUrl
    const requestUrl = customURL || fullUrl

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      cache: "no-store",
    }

    // Add body for non-GET requests
    if (method !== "GET" && body) {
      requestOptions.body = JSON.stringify(body)
    }

    // Perform fetch request
    const response = await fetch(requestUrl, requestOptions)

    // Check for HTTP errors
    if (!response.ok) {
      const errorData = await response.json()
      return Promise.reject(
        new Error(errorData.error || "A network error occurred."),
      )
    }

    const data = await response.json()

    // Transform response data if transformer is provide  d
    const transformedData: ResponseType = transformResponse
      ? transformResponse(data)
      : data

    return transformedData
  } catch (error: unknown) {
    return Promise.reject(clientErrorHandler(error))
  }
}
