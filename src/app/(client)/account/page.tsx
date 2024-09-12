// components
// import ContentLayout from "@/app/(admin)/_components/content-layout"
import AccountClient from "@/app/(client)/_components/account/client"
import BounceWrapper from "@/components/shared/bounce"
// import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"

// utils
// import { accountItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Account",
}

export default function ClientAccountPage() {
  return (
    <BounceWrapper>
      {/* breadcrumb */}
      {/* <DynamicBreadcrumb items={accountItems} /> */}

      {/* client */}
      <AccountClient />
    </BounceWrapper>
  )
}
