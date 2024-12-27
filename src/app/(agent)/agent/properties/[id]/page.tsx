// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/agent/content-layout"
import PropertyClient from "@/components/agent/property/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/lib/actions/session/get"

// utils
import { propertyItems } from "@/lib/misc/breadcrumb-lists"
import { dataSerializer } from "@/lib/utils"

// types
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Property",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyIdPage({ params }: PageProps) {
  const [sessionData, resolvedParams] = await Promise.all([
    getSession(),
    params,
  ])
  const userData = dataSerializer(sessionData)
  const { id } = resolvedParams
  return (
    <HydrationBoundaryWrapper accountId={userData.id} propertyId={id}>
      <ContentLayout title="Property">
        <BounceWrapper>
          <DynamicBreadcrumb items={propertyItems} />
          <PropertyClient id={id} />
        </BounceWrapper>
      </ContentLayout>
    </HydrationBoundaryWrapper>
  )
}
