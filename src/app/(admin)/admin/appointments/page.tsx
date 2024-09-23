// components
import AppointmentsClient from "@/app/(admin)/_components/appointments/client"
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import ContentLayout from "@/app/(admin)/_components/shared/content-layout"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/app/(auth)/_actions/session/get"

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
