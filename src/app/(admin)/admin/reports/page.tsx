// components
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/admin/content-layout"
import QueryHydrator from "@/components/shared/query-hydrator"
import ReportsClient from "@/components/admin/reports/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchAppointments } from "@/lib/actions/appointment/get-all"
import { preFetchPayments } from "@/lib/actions/payment/get-all"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// utils
import { reportItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Reports",
}

export default async function ReportsPage() {
  const [, fetchAccount, fetchPayments, fetchAppointments] = await Promise.all([
    getSession(),
    preFetchAccount((await getSession()).id!),
    preFetchPayments(),
    preFetchAppointments(),
  ])
  return (
    <QueryHydrator
      prefetchFns={[fetchAccount, fetchPayments, fetchAppointments]}
    >
      <ContentLayout title="Reports">
        <BounceWrapper>
          <DynamicBreadcrumb items={reportItems} />
          <ReportsClient />
        </BounceWrapper>
      </ContentLayout>
    </QueryHydrator>
  )
}
