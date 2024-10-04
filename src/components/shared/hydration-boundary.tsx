"use server"

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

// utils
import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query"

const HydrationBoundaryWrapper = ({
  children,
  accountId,
  appointmentId,
  paymentId,
  propertyId,
}: {
  children: React.ReactNode
  accountId?: string
  appointmentId?: string
  paymentId?: string
  propertyId?: string
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
    queryKey: ["property", propertyId!],
    queryFn: async () => preFetchProperty(propertyId!),
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
