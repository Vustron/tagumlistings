// utils
import redis, { rateLimiter } from "@/lib/config/redis"
import { ErrorHandler } from "@/lib/utils"
import { NextResponse } from "next/server"
import { getClientIp } from "request-ip"
import { routes } from "@/server/routes"

// actions
import { preFetchAppointmentDates } from "@/lib/actions/appointment/get-dates"
import { preFetchAppointments } from "@/lib/actions/appointment/get-all"
import { preFetchProperties } from "@/lib/actions/property/get-all"
import { preFetchAppointment } from "@/lib/actions/appointment/get"
import { preFetchPayments } from "@/lib/actions/payment/get-all"
import { preFetchProperty } from "@/lib/actions/property/get"
import { preFetchAccounts } from "@/lib/actions/auth/get-all"
import { preFetchPayment } from "@/lib/actions/payment/get"
import { preFetchAccount } from "@/lib/actions/auth/get"

// types
import type {
  CompatibleRequest,
  ErrorResponseData,
  QueryKeys,
  RouteConfig,
  UserData,
} from "@/lib/types"
import type { NextRequest } from "next/server"
import type { HttpMethod } from "@/server/routes"
import { preFetchMessages } from "@/lib/hooks/messages/get-all"

/**------------------util non async functions ------------------**/

// api request handler
export async function handleRequest(
  request: NextRequest,
  method: HttpMethod,
): Promise<NextResponse> {
  const pathname = new URL(request.url).pathname
  const route = routes[method].find((r) => r.path === pathname)

  if (route) {
    try {
      return await route.handler(request)
    } catch (error) {
      return handleErrorResponse(error)
    }
  }

  return NextResponse.json({ message: "Not Found" }, { status: 404 })
}

// will handle the error messages
export async function handleErrorResponse(error: unknown) {
  // Handle the error using the ErrorHandler
  const { message, statusCode }: ErrorResponseData =
    ErrorHandler.handleError(error)

  // Return the error response
  return NextResponse.json({ error: message }, { status: statusCode })
}

export async function convertAndCheckRateLimit(request: NextRequest) {
  const compatibleRequest: CompatibleRequest = {
    headers: Object.fromEntries(request.headers.entries()),
    url: request.url,
    method: request.method,
  } as CompatibleRequest

  const clientIp = getClientIp(compatibleRequest) || "NA"

  // Rate limit check
  const limit = await rateLimiter.get({
    id: clientIp,
  })

  if (!limit.remaining) {
    return NextResponse.json(
      {
        error: "Sorry, you are rate limited. Wait for 5 seconds",
      },
      { status: 429 },
    )
  }

  return { clientIp, compatibleRequest }
}

export async function getAccountsFromDB(dbKey: string): Promise<UserData[]> {
  const existingUserData = await redis.get(dbKey)

  const users: UserData[] = existingUserData
    ? (JSON.parse(existingUserData) as UserData[])
    : []

  return users
}

export async function findAccountByParams<T extends keyof UserData>(
  accounts: UserData[],
  param: T,
  value: UserData[T],
): Promise<{ account: UserData | undefined; response?: NextResponse }> {
  // Find the user index based on the dynamic parameter
  const accountIndex = accounts.findIndex(
    (account: UserData) => account[param] === value,
  )

  // Return error response if user isn't found
  if (accountIndex === -1) {
    return {
      account: undefined,
      response: NextResponse.json(
        { error: "Account not found" },
        { status: 404 },
      ),
    }
  }

  // Return the existing user data
  const existingAccount = accounts[accountIndex]
  return { account: existingAccount }
}

// query keys
const queryKeys: QueryKeys = {
  account: (id) => ["account", id],
  accounts: () => ["accounts"],
  properties: () => ["properties"],
  property: (id) => ["property", id],
  appointments: () => ["appointments"],
  appointmentDates: () => ["appointment-dates"],
  appointment: (id) => ["appointment", id],
  payments: () => ["payments"],
  payment: (id) => ["payment", id],
  messages: () => ["messages"],
}

// determine the pathname for query key
export const determinePrefetchQueryKey = (
  fetchFn: () => Promise<unknown>,
  {
    accountId,
    appointmentId,
    paymentId,
    propertyId,
  }: {
    accountId?: string
    appointmentId?: string
    paymentId?: string
    propertyId?: string
  },
): unknown[] => {
  const fnString = fetchFn.toString()

  const matches = fnString.match(/preFetch(\w+)/)
  if (!matches) return ["unknown"]

  const functionName = matches[1]!.toLowerCase()

  switch (functionName) {
    case "account":
      return accountId ? queryKeys.account(accountId) : ["unknown"]

    case "accounts":
      return queryKeys.accounts()

    case "property":
      return propertyId ? queryKeys.property(propertyId) : ["unknown"]

    case "properties":
      return queryKeys.properties()

    case "appointment":
      return appointmentId ? queryKeys.appointment(appointmentId) : ["unknown"]

    case "appointments":
      return queryKeys.appointments()

    case "appointmentdates":
      return queryKeys.appointmentDates()

    case "payment":
      return paymentId ? queryKeys.payment(paymentId) : ["unknown"]

    case "payments":
      return queryKeys.payments()

    case "messages":
      return queryKeys.messages()

    default:
      return ["unknown"]
  }
}

// hydration route configs
export const createRouteConfigs = (props: {
  accountId?: string
  appointmentId?: string
  paymentId?: string
  propertyId?: string
}): RouteConfig[] => {
  const { accountId, appointmentId, paymentId, propertyId } = props

  return [
    {
      pathname: "/admin",
      prefetchFns: [() => preFetchProperties(), () => preFetchAppointments()],
    },
    {
      pathname: "/admin/account",
      prefetchFns: [() => preFetchAccounts()],
    },
    {
      pathname: "/admin/users",
      prefetchFns: [() => preFetchAccounts()],
    },
    {
      pathname: `/admin/users/${accountId}`,
      prefetchFns: accountId ? [() => preFetchAccount(accountId)] : [],
    },
    {
      pathname: "/admin/appointments",
      prefetchFns: [
        () => preFetchAppointments(),
        () => preFetchAppointmentDates(),
        () => preFetchAccounts(),
      ],
    },
    {
      pathname: `/admin/appointments/${appointmentId}`,
      prefetchFns: appointmentId
        ? [
            () => preFetchAppointment(appointmentId),
            () => preFetchAppointmentDates(),
            () => preFetchAccounts(),
          ]
        : [],
    },
    {
      pathname: "/admin/payments",
      prefetchFns: [() => preFetchPayments(), () => preFetchAccounts()],
    },
    {
      pathname: `/admin/payments/${paymentId}`,
      prefetchFns: paymentId
        ? [
            () => preFetchPayment(paymentId),
            () => preFetchAccounts(),
            () => preFetchProperties(),
            () => preFetchAppointments(),
          ]
        : [],
    },
    {
      pathname: "/admin/payments/new",
      prefetchFns: [
        () => preFetchAccounts(),
        () => preFetchProperties(),
        () => preFetchAppointments(),
      ],
    },
    {
      pathname: "/admin/properties",
      prefetchFns: [() => preFetchProperties()],
    },
    {
      pathname: `/admin/properties/${propertyId}`,
      prefetchFns: propertyId ? [() => preFetchProperty(propertyId)] : [],
    },
    {
      pathname: "/admin/properties/new",
      prefetchFns: [],
    },
    {
      pathname: "/properties",
      prefetchFns: [() => preFetchProperties()],
    },
    {
      pathname: `/properties/${propertyId}`,
      prefetchFns: propertyId ? [() => preFetchProperty(propertyId)] : [],
    },
    {
      pathname: "/search",
      prefetchFns: [() => preFetchProperties()],
    },
    {
      pathname: "/admin/messages",
      prefetchFns: [() => preFetchAccounts(), () => preFetchMessages()],
    },
  ]
}
