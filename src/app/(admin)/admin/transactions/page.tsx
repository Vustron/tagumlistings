// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import ContentLayout from "@/components/layouts/admin/content-layout"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import PaymentsClient from "@/components/admin/payments/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/lib/actions/session/get"

// utils
import { transactionsItems } from "@/lib/misc/breadcrumb-lists"
import { dataSerializer } from "@/lib/utils"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Transactions",
}

export default async function PaymentsPage() {
  // get session
  const session = await getSession()

  // session serialize
  const userData = dataSerializer(session)

  return (
    <HydrationBoundaryWrapper accountId={userData.id}>
      <ContentLayout title="Transactions">
        <BounceWrapper>
          <DynamicBreadcrumb items={transactionsItems} />
          <PaymentsClient />
        </BounceWrapper>
      </ContentLayout>
    </HydrationBoundaryWrapper>
  )
}
