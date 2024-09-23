"use server"

// actions
import { preFetchAppointmentDates } from "@/app/(admin)/_actions/appointment/get-dates"
import { preFetchAppointments } from "@/app/(admin)/_actions/appointment/get-all"
import { preFetchProperties } from "@/app/(admin)/_actions/property/get-all"
import { preFetchAccounts } from "@/app/(auth)/_actions/auth/get-all"
import { preFetchAccount } from "@/app/(auth)/_actions/auth/get"

// utils
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"

const HydrationBoundaryWrapper = ({
  children,
  accountId,
}: {
  children: React.ReactNode
  accountId?: string
}) => {
  const queryClient = new QueryClient()

  void queryClient.prefetchQuery({
    queryKey: ["account", accountId],
    queryFn: async () => preFetchAccount(accountId!),
  })

  void queryClient.prefetchQuery({
    queryKey: ["accounts"],
    queryFn: async () => preFetchAccounts(),
  })

  void queryClient.prefetchQuery({
    queryKey: ["properties"],
    queryFn: async () => preFetchProperties(),
  })

  void queryClient.prefetchQuery({
    queryKey: ["appointments"],
    queryFn: async () => preFetchAppointments(),
  })

  void queryClient.prefetchQuery({
    queryKey: ["appointment-dates"],
    queryFn: async () => preFetchAppointmentDates(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

export default HydrationBoundaryWrapper
