// components
import ContentLayout from "@/app/(admin)/_components/content-layout"
import PaymentsClient from "@/app/(admin)/payments/_components/client"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"

// utils
import { paymentsItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Payments",
}

export default function PaymentsPage() {
  return (
    <ContentLayout title="Payments">
      {/* breadcrumb */}
      <DynamicBreadcrumb items={paymentsItems} />

      {/* client */}
      <PaymentsClient />
    </ContentLayout>
  )
}
