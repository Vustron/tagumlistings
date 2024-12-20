// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import ContentLayout from "@/components/layouts/admin/content-layout"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import PaymentClient from "@/components/admin/payment/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/lib/actions/session/get"

// utils
import { transactionItems } from "@/lib/misc/breadcrumb-lists"
import { dataSerializer } from "@/lib/utils"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Transaction",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PaymentIDPage({ params }: PageProps) {
  const [sessionData, resolvedParams] = await Promise.all([
    getSession(),
    params,
  ])
  const userData = dataSerializer(sessionData)
  const { id } = resolvedParams
  return (
    <HydrationBoundaryWrapper accountId={userData.id} paymentId={id}>
      <ContentLayout title="Appointment">
        <BounceWrapper>
          <DynamicBreadcrumb items={transactionItems} />

          <PaymentClient id={id} />
        </BounceWrapper>
      </ContentLayout>
    </HydrationBoundaryWrapper>
  )
}
