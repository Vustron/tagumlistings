// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/agent/content-layout"
import AddPaymentClient from "@/components/agent/new-payment/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/lib/actions/session/get"

// utils
import { addPaymentItems } from "@/lib/misc/breadcrumb-lists"
import { dataSerializer } from "@/lib/utils"

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

export default async function NewPaymentPage({ searchParams }: PageProps) {
  const [sessionData, resolvedSearchParams] = await Promise.all([
    getSession(),
    searchParams,
  ])
  const userData = dataSerializer(sessionData)
  const { property, price } = resolvedSearchParams
  return (
    <HydrationBoundaryWrapper accountId={userData.id}>
      <ContentLayout title="Add Transaction">
        <BounceWrapper>
          <DynamicBreadcrumb items={addPaymentItems} />
          <AddPaymentClient property={property} price={price} />
        </BounceWrapper>
      </ContentLayout>
    </HydrationBoundaryWrapper>
  )
}
