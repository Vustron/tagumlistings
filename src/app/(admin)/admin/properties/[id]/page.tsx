// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/admin/content-layout"
import PropertyClient from "@/components/admin/property/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/lib/actions/session/get"

// utils
import { propertyItems } from "@/lib/misc/breadcrumb-lists"
import { dataSerializer } from "@/lib/utils"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Property",
}

export default async function PropertyIdPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()

  const userData = dataSerializer(session)

  return (
    <HydrationBoundaryWrapper accountId={userData.id} propertyId={params.id}>
      <ContentLayout title="Property">
        <BounceWrapper>
          <DynamicBreadcrumb items={propertyItems} />

          <PropertyClient id={params.id} />
        </BounceWrapper>
      </ContentLayout>
    </HydrationBoundaryWrapper>
  )
}
