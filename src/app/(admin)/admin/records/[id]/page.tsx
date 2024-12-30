// components
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/admin/content-layout"
import QueryHydrator from "@/components/shared/query-hydrator"
import RecordClient from "@/components/admin/record/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchAppointments } from "@/lib/actions/appointment/get-all"
import { preFetchProperties } from "@/lib/actions/property/get-all"
import { preFetchAccounts } from "@/lib/actions/auth/get-all"
import { preFetchPayment } from "@/lib/actions/payment/get"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// utils
import { recordItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Transaction",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RecordIdPage({ params }: PageProps) {
  const [
    ,
    fetchAccount,
    fetchAccounts,
    fetchAppointments,
    fetchProperties,
    fetchRecord,
    resolvedParams,
  ] = await Promise.all([
    getSession(),
    preFetchAccount((await getSession()).id!),
    preFetchAccounts(),
    preFetchAppointments(),
    preFetchProperties(),
    preFetchPayment((await params).id),
    params,
  ])
  const { id } = resolvedParams
  return (
    <QueryHydrator
      prefetchFns={[
        fetchAccount,
        fetchAccounts,
        fetchAppointments,
        fetchProperties,
        fetchRecord,
      ]}
    >
      <ContentLayout title="Record">
        <BounceWrapper>
          <DynamicBreadcrumb items={recordItems} />
          <RecordClient id={id} />
        </BounceWrapper>
      </ContentLayout>
    </QueryHydrator>
  )
}
