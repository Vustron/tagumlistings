// components
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/agent/content-layout"
import QueryHydrator from "@/components/shared/query-hydrator"
import RecordsClient from "@/components/agent/records/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchPayments } from "@/lib/actions/payment/get-all"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// utils
import { recordsItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Records",
}

export default async function RecordsPage() {
  const [, fetchAccount, fetchPayments] = await Promise.all([
    getSession(),
    preFetchAccount((await getSession()).id!),
    preFetchPayments(),
  ])
  return (
    <QueryHydrator prefetchFns={[fetchAccount, fetchPayments]}>
      <ContentLayout title="Records">
        <BounceWrapper>
          <DynamicBreadcrumb items={recordsItems} />
          <RecordsClient />
        </BounceWrapper>
      </ContentLayout>
    </QueryHydrator>
  )
}
