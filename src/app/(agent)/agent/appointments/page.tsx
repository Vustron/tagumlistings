// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import AppointmentsClient from "@/components/agent/appointments/client"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/agent/content-layout"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/lib/actions/session/get"

// utils
import { appointmentsItems } from "@/lib/misc/breadcrumb-lists"
import { dataSerializer } from "@/lib/utils"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Appointments",
}

export default async function AppointmentsPage() {
  // get session
  const session = await getSession()

  // session serialize
  const userData = dataSerializer(session)

  return (
    <HydrationBoundaryWrapper accountId={userData.id}>
      <ContentLayout title="Appointments">
        <BounceWrapper>
          <DynamicBreadcrumb items={appointmentsItems} />
          <AppointmentsClient />
        </BounceWrapper>
      </ContentLayout>
    </HydrationBoundaryWrapper>
  )
}
