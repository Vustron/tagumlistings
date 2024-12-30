// components
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/admin/content-layout"
import QueryHydrator from "@/components/shared/query-hydrator"
import UsersClient from "@/components/admin/users/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchAccounts } from "@/lib/actions/auth/get-all"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// utils
import { usersItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Users",
}

export default async function UsersPage() {
  const [, fetchAccount, fetchAccounts] = await Promise.all([
    getSession(),
    preFetchAccount((await getSession()).id!),
    preFetchAccounts(),
  ])
  return (
    <QueryHydrator prefetchFns={[fetchAccount, fetchAccounts]}>
      <ContentLayout title="Users">
        <BounceWrapper>
          <DynamicBreadcrumb items={usersItems} />
          <UsersClient />
        </BounceWrapper>
      </ContentLayout>
    </QueryHydrator>
  )
}
