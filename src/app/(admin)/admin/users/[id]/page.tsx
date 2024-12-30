// components
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/admin/content-layout"
import QueryHydrator from "@/components/shared/query-hydrator"
import AccountClient from "@/components/admin/account/client"
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

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AccountIdPage({ params }: PageProps) {
  const [, resolvedParams, fetchAccount] = await Promise.all([
    getSession(),
    params,
    preFetchAccount((await getSession()).id!),
  ])
  const { id } = resolvedParams
  return (
    <QueryHydrator prefetchFns={[fetchAccount]}>
      <ContentLayout title="User">
        <BounceWrapper>
          <DynamicBreadcrumb items={accountItems} />
          <AccountClient id={id} />
        </BounceWrapper>
      </ContentLayout>
    </QueryHydrator>
  )
}
