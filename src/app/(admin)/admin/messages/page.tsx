// components
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/admin/content-layout"
import MessagesClient from "@/components/admin/messages/client"
import QueryHydrator from "@/components/shared/query-hydrator"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchAccounts } from "@/lib/actions/auth/get-all"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// utils
import { messagesItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Messages",
}

export default async function MessagesPage() {
  const [, fetchAccount, fetchAccounts] = await Promise.all([
    getSession(),
    preFetchAccount((await getSession()).id!),
    preFetchAccounts(),
  ])
  return (
    <QueryHydrator prefetchFns={[fetchAccount, fetchAccounts]}>
      <ContentLayout title="Messages">
        <BounceWrapper>
          <DynamicBreadcrumb items={messagesItems} />
          <MessagesClient isAdmin />
        </BounceWrapper>
      </ContentLayout>
    </QueryHydrator>
  )
}
