// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/admin/content-layout"
import AccountClient from "@/components/admin/account/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/lib/actions/session/get"

// utils
import { accountItems } from "@/lib/misc/breadcrumb-lists"
import { dataSerializer } from "@/lib/utils"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Account",
}

export default async function AccountPage() {
  const session = await getSession()
  const userData = dataSerializer(session)
  return (
    <HydrationBoundaryWrapper accountId={userData.id}>
      <ContentLayout title="Account">
        <BounceWrapper>
          <DynamicBreadcrumb items={accountItems} />
          <AccountClient id={userData.id} />
        </BounceWrapper>
      </ContentLayout>
    </HydrationBoundaryWrapper>
  )
}
