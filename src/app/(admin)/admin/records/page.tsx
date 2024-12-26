// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import ContentLayout from "@/components/layouts/admin/content-layout"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import RecordsClient from "@/components/admin/records/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/lib/actions/session/get"

// utils
import { recordsItems } from "@/lib/misc/breadcrumb-lists"
import { dataSerializer } from "@/lib/utils"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Records",
}

export default async function RecordsPage() {
  // get session
  const session = await getSession()

  // session serialize
  const userData = dataSerializer(session)

  return (
    <HydrationBoundaryWrapper accountId={userData.id}>
      <ContentLayout title="Records">
        <BounceWrapper>
          <DynamicBreadcrumb items={recordsItems} />
          <RecordsClient />
        </BounceWrapper>
      </ContentLayout>
    </HydrationBoundaryWrapper>
  )
}
