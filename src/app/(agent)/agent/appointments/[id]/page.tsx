// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import AppointmentClient from "@/components/admin/appointment/client"
import ContentLayout from "@/components/layouts/admin/content-layout"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/lib/actions/session/get"

// utils
import { appointmentItems } from "@/lib/misc/breadcrumb-lists"
import { dataSerializer } from "@/lib/utils"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Appointments",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AppointmentIDPage({ params }: PageProps) {
  const [sessionData, resolvedParams] = await Promise.all([
    getSession(),
    params,
  ])
  const userData = dataSerializer(sessionData)
  const { id } = resolvedParams
  return (
    <HydrationBoundaryWrapper accountId={userData.id} appointmentId={id}>
      <ContentLayout title="Appointment">
        <BounceWrapper>
          <DynamicBreadcrumb items={appointmentItems} />
          <AppointmentClient id={id} />
        </BounceWrapper>
      </ContentLayout>
    </HydrationBoundaryWrapper>
  )
}
