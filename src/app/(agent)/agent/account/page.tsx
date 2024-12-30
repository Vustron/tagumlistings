// components
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/agent/content-layout"
import QueryHydrator from "@/components/shared/query-hydrator"
import AccountClient from "@/components/agent/account/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// utils
import { accountItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Account",
}

export default async function AccountPage() {
  const [session, fetchAccount] = await Promise.all([
    getSession(),
    preFetchAccount((await getSession()).id!),
  ])
  return (
    <QueryHydrator prefetchFns={[fetchAccount]}>
      <ContentLayout title="Account">
        <BounceWrapper>
          <DynamicBreadcrumb items={accountItems} />
          <AccountClient id={session.id} />
        </BounceWrapper>
      </ContentLayout>
    </QueryHydrator>
  )
}
