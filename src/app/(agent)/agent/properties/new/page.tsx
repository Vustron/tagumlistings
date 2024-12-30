// components
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import AddPropertyClient from "@/components/agent/new-property/client"
import ContentLayout from "@/components/layouts/agent/content-layout"
import QueryHydrator from "@/components/shared/query-hydrator"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// utils
import { addPropertiesItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Add Property",
}

export default async function AddPropertyPage() {
  const [, fetchAccount] = await Promise.all([
    getSession(),
    preFetchAccount((await getSession()).id!),
  ])
  return (
    <QueryHydrator prefetchFns={[fetchAccount]}>
      <ContentLayout title="Add Properties">
        <BounceWrapper>
          <DynamicBreadcrumb items={addPropertiesItems} />
          <AddPropertyClient />
        </BounceWrapper>
      </ContentLayout>
    </QueryHydrator>
  )
}
