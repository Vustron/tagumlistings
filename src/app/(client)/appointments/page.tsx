// components
import AppointmentsClient from "@/components/client/appointments/client"
import QueryHydrator from "@/components/shared/query-hydrator"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchAppointmentDates } from "@/lib/actions/appointment/get-dates"
import { preFetchAppointments } from "@/lib/actions/appointment/get-all"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Appointments",
}

export default async function AppointmentsClientPage() {
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
      <div className="container p-5">
        <BounceWrapper>
          <AppointmentsClient />
        </BounceWrapper>
      </div>
    </QueryHydrator>
  )
}
