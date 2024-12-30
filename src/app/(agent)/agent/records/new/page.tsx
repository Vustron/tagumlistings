// components
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/agent/content-layout"
import AddPaymentClient from "@/components/agent/new-payment/client"
import QueryHydrator from "@/components/shared/query-hydrator"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchAppointments } from "@/lib/actions/appointment/get-all"
import { preFetchProperties } from "@/lib/actions/property/get-all"
import { preFetchAccounts } from "@/lib/actions/auth/get-all"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// utils
import { addPaymentItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Add Transaction",
}

interface PageProps {
  searchParams: Promise<{
    property?: string
    price?: string
  }>
}

export default async function NewRecordPage({ searchParams }: PageProps) {
  const [
    ,
    fetchAccount,
    fetchAccounts,
    fetchAppointments,
    fetchProperties,
    resolvedSearchParams,
  ] = await Promise.all([
    getSession(),
    preFetchAccount((await getSession()).id!),
    preFetchAccounts(),
    preFetchAppointments(),
    preFetchProperties(),
    searchParams,
  ])
  const { property, price } = resolvedSearchParams
  return (
    <QueryHydrator
      prefetchFns={[
        fetchAccount,
        fetchAccounts,
        fetchAppointments,
        fetchProperties,
      ]}
    >
      <ContentLayout title="Add Transaction">
        <BounceWrapper>
          <DynamicBreadcrumb items={addPaymentItems} />
          <AddPaymentClient property={property} price={price} />
        </BounceWrapper>
      </ContentLayout>
    </QueryHydrator>
  )
}
