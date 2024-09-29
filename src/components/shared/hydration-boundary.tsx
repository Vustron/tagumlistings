"use server"

// actions
import { preFetchAppointmentDates } from "@/app/(admin)/_actions/appointment/get-dates"
import { preFetchAppointments } from "@/app/(admin)/_actions/appointment/get-all"
import { preFetchProperties } from "@/app/(admin)/_actions/property/get-all"
import { preFetchAppointment } from "@/app/(admin)/_actions/appointment/get"
import { preFetchPayments } from "@/app/(admin)/_actions/payment/get-all"
import { preFetchAccounts } from "@/app/(auth)/_actions/auth/get-all"
import { preFetchPayment } from "@/app/(admin)/_actions/payment/get"
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
  appointmentId,
  paymentId,
}: {
  children: React.ReactNode
  accountId?: string
  appointmentId?: string
  paymentId?: string
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

  void queryClient.prefetchQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: async () => preFetchAppointment(appointmentId!),
  })

  void queryClient.prefetchQuery({
    queryKey: ["payments"],
    queryFn: async () => preFetchPayments(),
  })

  void queryClient.prefetchQuery({
    queryKey: ["payment", paymentId],
    queryFn: async () => preFetchPayment(paymentId!),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

export default HydrationBoundaryWrapper
