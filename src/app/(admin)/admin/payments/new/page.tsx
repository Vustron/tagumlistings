// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import AddPaymentClient from "@/app/(admin)/_components/new-payment/client"
import ContentLayout from "@/app/(admin)/_components/shared/content-layout"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/app/(auth)/_actions/session/get"

// utils
import { addPaymentItems } from "@/lib/misc/breadcrumb-lists"
import { dataSerializer } from "@/lib/utils"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Add Payment",
}

export default async function NewPaymentPage() {
  // get session
  const session = await getSession()

  // session serialize
  const userData = dataSerializer(session)

  return (
    <HydrationBoundaryWrapper accountId={userData.id}>
      <ContentLayout title="Add Payment">
        <BounceWrapper>
          <DynamicBreadcrumb items={addPaymentItems} />

          <AddPaymentClient />
        </BounceWrapper>
      </ContentLayout>
    </HydrationBoundaryWrapper>
  )
}
