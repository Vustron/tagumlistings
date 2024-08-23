// components
import ContentLayout from "@/app/(admin)/_components/content-layout"
import AppointmentsClient from "@/app/(admin)/appointments/_components/client"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"

// utils
import { appointmentsItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Appointments",
}

export default function AppointmentsPage() {
  return (
    <ContentLayout title="Appointments">
      {/* breadcrumb */}
      <DynamicBreadcrumb items={appointmentsItems} />

      {/* client */}
      <AppointmentsClient />
    </ContentLayout>
  )
}
