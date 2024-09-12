// components
import ContentLayout from "@/app/(admin)/_components/shared/content-layout"
import PropertiesClient from "@/app/(admin)/_components/properties/client"
import BounceWrapper from "@/components/shared/bounce"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"

// utils
import { properties } from "@/app/(admin)/_components/data/properties"
import { propertiesItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Properties",
}

export default function PropertiesPage() {
  return (
    <ContentLayout title="Properties">
      <BounceWrapper>
        {/* breadcrumb */}
        <DynamicBreadcrumb items={propertiesItems} />

        {/* client */}
        <PropertiesClient data={properties} />
      </BounceWrapper>
    </ContentLayout>
  )
}
