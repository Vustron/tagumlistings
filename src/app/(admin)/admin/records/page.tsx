// components
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/admin/content-layout"
import QueryHydrator from "@/components/shared/query-hydrator"
import RecordsClient from "@/components/admin/records/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
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
  const [, fetchAccount] = await Promise.all([
    getSession(),
    preFetchAccount((await getSession()).id!),
  ])
  return (
    <QueryHydrator prefetchFns={[fetchAccount]}>
      <ContentLayout title="Records">
        <BounceWrapper>
          <DynamicBreadcrumb items={recordsItems} />
          <RecordsClient />
        </BounceWrapper>
      </ContentLayout>
    </QueryHydrator>
  )
}
