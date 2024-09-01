// configs
import { env } from "@/lib/config/env.mjs"

// utils
import {
  HttpError,
  buildQueryString,
  clientErrorHandler,
  dataSerializer,
} from "@/lib/utils"

// types
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export interface RequestConfig<RequestType = unknown, ResponseType = unknown> {
  url?: string
  isCustomUrl?: boolean
  method: HttpMethod
  params?: Record<string, string | number | boolean>
  headers?: HeadersInit
  body?: RequestType
  transformResponse?: (data: unknown) => ResponseType
  customURL?: string
  timeout?: number
  retries?: number
}

async function makeHttpRequest<RequestType = unknown, ResponseType = unknown>(
  config: RequestConfig<RequestType, ResponseType>,
): Promise<ResponseType> {
  const {
    url,
    method,
    params,
    headers = {},
    body,
    transformResponse,
    customURL,
    timeout = 24 * 60 * 60,
    retries = 3,
  } = config

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  const makeRequest = async (attempt: number): Promise<ResponseType> => {
    try {
      if (!url && !customURL) {
        throw new HttpError(400, "No URL provided for the API request")
      }

      const fullUrl = url
        ? `${env.NEXT_PUBLIC_APP_URL}/api/v1/${url}${buildQueryString(params)}`
        : ""
      let requestUrl = customURL || fullUrl

      // Validate URL
      try {
        new URL(requestUrl)
      } catch {
        throw new HttpError(400, "Invalid URL provided for the API request")
      }

      const requestOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        cache: "no-store",
        signal: controller.signal,
      }

      if (method === "GET" && body) {
        const serializedBody = dataSerializer(body)
        const bodyParams = new URLSearchParams(
          serializedBody as Record<string, string>,
        )
        requestUrl +=
          (requestUrl.includes("?") ? "&" : "?") + bodyParams.toString()
      } else if (body) {
        const serializedBody = dataSerializer(body)
        requestOptions.body = JSON.stringify(serializedBody)
      }

      // Perform fetch request
      const response = await fetch(requestUrl, requestOptions)

      if (!response.ok) {
        const errorData = await response.json()
        throw new HttpError(
          response.status,
          errorData.error || "A network error occurred.",
        )
      }

      let data: unknown
      const textResponse = await response.text()
      try {
        data = JSON.parse(textResponse)
      } catch (error) {
        console.error("Error parsing response:", error)
        throw new HttpError(500, "Error parsing response")
      }

      const serializedData = dataSerializer(data)

      const transformedData: ResponseType = transformResponse
        ? transformResponse(serializedData)
        : (serializedData as ResponseType)

      return dataSerializer(transformedData)
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        throw error
      }

      if (attempt < retries) {
        console.warn(`Request failed, retrying (${attempt + 1}/${retries})`)
        return makeRequest(attempt + 1)
      }

      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }

  try {
    return await makeRequest(0)
  } catch (error) {
    throw clientErrorHandler(error)
  }
}

export function httpRequest<RequestType = unknown, ResponseType = unknown>(
  urlOrCustomURL: string,
  method: HttpMethod,
  options: Partial<
    Omit<
      RequestConfig<RequestType, ResponseType>,
      "url" | "method" | "customURL"
    >
  > = {},
): Promise<ResponseType> {
  const isCustomURL =
    urlOrCustomURL.startsWith("http://") ||
    urlOrCustomURL.startsWith("https://")

  return makeHttpRequest<RequestType, ResponseType>({
    ...(isCustomURL ? { customURL: urlOrCustomURL } : { url: urlOrCustomURL }),
    method,
    ...options,
  })
}
