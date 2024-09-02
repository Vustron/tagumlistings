// components
import ContentLayout from "@/app/(admin)/_components/content-layout"
import MessagesClient from "@/app/(admin)/admin/messages/_components/client"
import BounceWrapper from "@/components/shared/bounce"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"

// utils
import { messagesItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Messages",
}

export default function MessagesPage() {
  return (
    <ContentLayout title="Messages">
      <BounceWrapper>
        {/* breadcrumb */}
        <DynamicBreadcrumb items={messagesItems} />

        {/* client */}
        <MessagesClient />
      </BounceWrapper>
    </ContentLayout>
  )
}
