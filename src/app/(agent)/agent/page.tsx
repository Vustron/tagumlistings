// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import AgentDashboardClient from "@/components/agent/dashboard/client"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/admin/content-layout"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/lib/actions/session/get"

// utils
import { dashboardItems } from "@/lib/misc/breadcrumb-lists"
import { dataSerializer } from "@/lib/utils"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Agent",
}

export default async function AgentDashboardPage() {
  // get session
  const session = await getSession()

  // session serialize
  const userData = dataSerializer(session)

  return (
    <HydrationBoundaryWrapper accountId={userData.id}>
      <ContentLayout title="Dashboard">
        <BounceWrapper>
          <DynamicBreadcrumb items={dashboardItems} />
          <AgentDashboardClient />
        </BounceWrapper>
      </ContentLayout>
    </HydrationBoundaryWrapper>
  )
}
