// components
import AgentDashboardClient from "@/components/agent/dashboard/client"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/agent/content-layout"
import QueryHydrator from "@/components/shared/query-hydrator"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchAppointments } from "@/lib/actions/appointment/get-all"
import { preFetchProperties } from "@/lib/actions/property/get-all"
import { preFetchPayments } from "@/lib/actions/payment/get-all"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// utils
import { dashboardItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Agent",
}

export default async function AgentDashboardPage() {
  const [, fetchAccount, fetchAppointments, fetchProperties, fetchPayments] =
    await Promise.all([
      getSession(),
      preFetchAccount((await getSession()).id!),
      preFetchAppointments(),
      preFetchProperties(),
      preFetchPayments(),
    ])
  return (
    <QueryHydrator
      prefetchFns={[
        fetchAccount,
        fetchAppointments,
        fetchProperties,
        fetchPayments,
      ]}
    >
      <ContentLayout title="Dashboard">
        <BounceWrapper>
          <DynamicBreadcrumb items={dashboardItems} />
          <AgentDashboardClient />
        </BounceWrapper>
      </ContentLayout>
    </QueryHydrator>
  )
}
