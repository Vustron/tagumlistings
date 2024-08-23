// components
import ContentLayout from "@/app/(admin)/_components/content-layout"
import AccountClient from "@/app/(admin)/account/_components/client"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"

// utils
import { dashboardItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Account",
}

export default function AccountPage() {
  return (
    <ContentLayout title="Account">
      {/* breadcrumb */}
      <DynamicBreadcrumb items={dashboardItems} />

      {/* client */}
      <AccountClient />
    </ContentLayout>
  )
}
