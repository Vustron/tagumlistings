"use server"

// utils
import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query"
import { createRouteConfigs, determinePrefetchQueryKey } from "@/lib/helpers"
import { headers } from "next/headers"

// types
import type { ReactNode } from "react"

const HydrationBoundaryWrapper = ({
  children,
  accountId,
  appointmentId,
  paymentId,
  propertyId,
}: {
  children: ReactNode
  accountId?: string
  appointmentId?: string
  paymentId?: string
  propertyId?: string
}) => {
  const headersList = headers()
  const pathname = headersList.get("x-pathname") || "/"

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 2,
      },
    },
  })

  const routeConfigs = createRouteConfigs({
    accountId,
    appointmentId,
    paymentId,
    propertyId,
  })

  const currentRoute = routeConfigs.find((route) => route.pathname === pathname)

  const safePrefetch = async <T,>(
    fetchFn: () => Promise<T>,
    queryKey: unknown[],
  ) => {
    try {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: fetchFn,
        retry: false,
      })
    } catch (error) {
      console.error(`Error prefetching ${queryKey[0]}:`, error)
    }
  }

  if (currentRoute) {
    void Promise.all(
      currentRoute.prefetchFns.map((fn) => {
        const queryKey = determinePrefetchQueryKey(fn, {
          accountId,
          appointmentId,
          paymentId,
          propertyId,
        })
        return safePrefetch(fn, queryKey)
      }),
    )
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

export default HydrationBoundaryWrapper
