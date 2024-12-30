// components
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/agent/content-layout"
import PropertyClient from "@/components/agent/property/client"
import QueryHydrator from "@/components/shared/query-hydrator"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchProperty } from "@/lib/actions/property/get"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// utils
import { propertyItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"
import { preFetchAccounts } from "@/lib/actions/auth/get-all"

export const metadata: Metadata = {
  title: "Property",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyIdPage({ params }: PageProps) {
  const [, fetchAccount, fetchAccounts, fetchProperty, resolvedParams] =
    await Promise.all([
      getSession(),
      preFetchAccount((await getSession()).id!),
      preFetchAccounts(),
      preFetchProperty((await params).id),
      params,
    ])
  const { id } = resolvedParams
  return (
    <QueryHydrator prefetchFns={[fetchAccount, fetchAccounts, fetchProperty]}>
      <ContentLayout title="Property">
        <BounceWrapper>
          <DynamicBreadcrumb items={propertyItems} />
          <PropertyClient id={id} />
        </BounceWrapper>
      </ContentLayout>
    </QueryHydrator>
  )
}
