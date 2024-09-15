// components
import ContentLayout from "@/app/(admin)/_components/shared/content-layout"
import AccountClient from "@/app/(admin)/_components/account/client"
import BounceWrapper from "@/components/shared/bounce"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"

// actions
import { getSession } from "@/app/(auth)/_actions/get-session"

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
    <ContentLayout title="Account">
      <BounceWrapper>
        {/* breadcrumb */}
        <DynamicBreadcrumb items={accountItems} />

        {/* client */}
        <AccountClient id={userData.id} />
      </BounceWrapper>
    </ContentLayout>
  )
}
