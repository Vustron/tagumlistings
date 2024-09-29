// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import ContentLayout from "@/app/(admin)/_components/shared/content-layout"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import PaymentClient from "@/app/(admin)/_components/payment/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/app/(auth)/_actions/session/get"

// utils
import { paymentItems } from "@/lib/misc/breadcrumb-lists"
import { dataSerializer } from "@/lib/utils"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Payment",
}

export default async function PaymentIDPage({
  params,
}: { params: { id: string } }) {
  // get session
  const session = await getSession()

  // session serialize
  const userData = dataSerializer(session)

  return (
    <HydrationBoundaryWrapper accountId={userData.id} paymentId={params.id}>
      <ContentLayout title="Appointment">
        <BounceWrapper>
          <DynamicBreadcrumb items={paymentItems} />

          <PaymentClient id={params.id} />
        </BounceWrapper>
      </ContentLayout>
    </HydrationBoundaryWrapper>
  )
}
