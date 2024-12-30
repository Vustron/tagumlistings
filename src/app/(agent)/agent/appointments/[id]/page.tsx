// components
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import AppointmentClient from "@/components/agent/appointment/client"
import ContentLayout from "@/components/layouts/agent/content-layout"
import QueryHydrator from "@/components/shared/query-hydrator"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchAppointmentDates } from "@/lib/actions/appointment/get-dates"
import { preFetchAppointment } from "@/lib/actions/appointment/get"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// utils
import { appointmentItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"
import { preFetchAccounts } from "@/lib/actions/auth/get-all"

// meta data
export const metadata: Metadata = {
  title: "Appointments",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AppointmentIDPage({ params }: PageProps) {
  const [
    ,
    fetchAccount,
    fetchAccounts,
    fetchAppointment,
    fetchAppointmentDates,
    resolvedParams,
  ] = await Promise.all([
    getSession(),
    preFetchAccount((await getSession()).id!),
    preFetchAccounts(),
    preFetchAppointment((await params).id),
    preFetchAppointmentDates(),
    params,
  ])
  const { id } = resolvedParams
  return (
    <QueryHydrator
      prefetchFns={[
        fetchAccount,
        fetchAccounts,
        fetchAppointment,
        fetchAppointmentDates,
      ]}
    >
      <ContentLayout title="Appointment">
        <BounceWrapper>
          <DynamicBreadcrumb items={appointmentItems} />
          <AppointmentClient id={id} />
        </BounceWrapper>
      </ContentLayout>
    </QueryHydrator>
  )
}
