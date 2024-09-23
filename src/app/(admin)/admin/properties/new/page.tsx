// components
import AddPropertyClient from "@/app/(admin)/_components/new-property/client"
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import ContentLayout from "@/app/(admin)/_components/shared/content-layout"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/app/(auth)/_actions/session/get"

// utils
import { addPropertiesItems } from "@/lib/misc/breadcrumb-lists"
import { dataSerializer } from "@/lib/utils"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Add Property",
}

export default async function PropertiesPage() {
  // get session
  const session = await getSession()

  // session serialize
  const userData = dataSerializer(session)

  return (
    <HydrationBoundaryWrapper accountId={userData.id}>
      <ContentLayout title="Add Properties">
        <BounceWrapper>
          <DynamicBreadcrumb items={addPropertiesItems} />

          <AddPropertyClient />
        </BounceWrapper>
      </ContentLayout>
    </HydrationBoundaryWrapper>
  )
}
