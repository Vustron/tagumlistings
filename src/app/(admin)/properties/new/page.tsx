// components
import ContentLayout from "@/app/(admin)/_components/content-layout"
import AddPropertyClient from "@/app/(admin)/properties/new/_components/client"
import BounceWrapper from "@/components/shared/bounce"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"

// utils
import { addPropertiesItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Add Property",
}

export default function PropertiesPage() {
  return (
    <ContentLayout title="Add Properties">
      <BounceWrapper>
        {/* breadcrumb */}
        <DynamicBreadcrumb items={addPropertiesItems} />

        {/* client */}
        <AddPropertyClient />
      </BounceWrapper>
    </ContentLayout>
  )
}
