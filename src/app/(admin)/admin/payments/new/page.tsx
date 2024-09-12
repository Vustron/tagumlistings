// components
import ContentLayout from "@/app/(admin)/_components/shared/content-layout"
import AddPropertyClient from "@/app/(admin)/_components/new-property/client"
import BounceWrapper from "@/components/shared/bounce"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"

// utils
import { addPaymentItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Add Payment",
}

export default function PropertiesPage() {
  return (
    <ContentLayout title="Add Payment">
      <BounceWrapper>
        {/* breadcrumb */}
        <DynamicBreadcrumb items={addPaymentItems} />

        {/* client */}
        <AddPropertyClient />
      </BounceWrapper>
    </ContentLayout>
  )
}
