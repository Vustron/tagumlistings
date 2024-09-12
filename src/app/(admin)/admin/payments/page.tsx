// components
import ContentLayout from "@/app/(admin)/_components/shared/content-layout"
import PaymentsClient from "@/app/(admin)/_components/payments/client"
import BounceWrapper from "@/components/shared/bounce"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"

// utils
import { payments } from "@/app/(admin)/_components/data/payments"
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
      <BounceWrapper>
        {/* breadcrumb */}
        <DynamicBreadcrumb items={paymentsItems} />

        {/* client */}
        <PaymentsClient data={payments} />
      </BounceWrapper>
    </ContentLayout>
  )
}
