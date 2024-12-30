// components
import AppointmentsClient from "@/components/admin/appointments/client"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/admin/content-layout"
import QueryHydrator from "@/components/shared/query-hydrator"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchAppointmentDates } from "@/lib/actions/appointment/get-dates"
import { preFetchAppointments } from "@/lib/actions/appointment/get-all"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// utils
import { appointmentsItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Appointments",
}

export default async function AppointmentsPage() {
  const [, fetchAccount, fetchAppointments, fetchAppointmentDates] =
    await Promise.all([
      getSession(),
      preFetchAccount((await getSession()).id!),
      preFetchAppointments(),
      preFetchAppointmentDates(),
    ])
  return (
    <QueryHydrator
      prefetchFns={[fetchAccount, fetchAppointments, fetchAppointmentDates]}
    >
      <ContentLayout title="Appointments">
        <BounceWrapper>
          <DynamicBreadcrumb items={appointmentsItems} />
          <AppointmentsClient />
        </BounceWrapper>
      </ContentLayout>
    </QueryHydrator>
  )
}
