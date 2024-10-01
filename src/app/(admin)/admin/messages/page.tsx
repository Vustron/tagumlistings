// components
import ContentLayout from "@/components/layouts/admin/content-layout"
import MessagesClient from "@/components/admin/messages/client"
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
        <MessagesClient isAdmin />
      </BounceWrapper>
    </ContentLayout>
  )
}
