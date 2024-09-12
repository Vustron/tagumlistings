// components
import ContentLayout from "@/app/(admin)/_components/shared/content-layout"
import AccountClient from "@/app/(admin)/_components/account/client"
import BounceWrapper from "@/components/shared/bounce"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"

// utils
import { accountItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Account",
}

export default function AccountPage() {
  return (
    <ContentLayout title="Account">
      <BounceWrapper>
        {/* breadcrumb */}
        <DynamicBreadcrumb items={accountItems} />

        {/* client */}
        <AccountClient />
      </BounceWrapper>
    </ContentLayout>
  )
}
