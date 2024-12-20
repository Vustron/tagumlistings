// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/admin/content-layout"
import AddPaymentClient from "@/components/admin/new-payment/client"
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

export default async function NewPaymentPage({
  searchParams,
}: {
  searchParams: { property?: string; price?: string }
}) {
  const session = await getSession()
  const userData = dataSerializer(session)
  return (
    <HydrationBoundaryWrapper accountId={userData.id}>
      <ContentLayout title="Add Transaction">
        <BounceWrapper>
          <DynamicBreadcrumb items={addPaymentItems} />
          <AddPaymentClient
            property={searchParams.property}
            price={searchParams.price}
          />
        </BounceWrapper>
      </ContentLayout>
    </HydrationBoundaryWrapper>
  )
}
