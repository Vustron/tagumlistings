// components
import ContentLayout from "@/app/(admin)/_components/shared/content-layout"
import AdminDashboardClient from "@/app/(admin)/_components/dashboard/client"
import BounceWrapper from "@/components/shared/bounce"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"

// utils
import { dashboardItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Admin",
}

export default function AdminDashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <BounceWrapper>
        {/* breadcrumb */}
        <DynamicBreadcrumb items={dashboardItems} />

        {/* client */}
        <AdminDashboardClient />
      </BounceWrapper>
    </ContentLayout>
  )
}
