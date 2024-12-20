// components
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import ContentLayout from "@/components/layouts/admin/content-layout"
import MessagesClient from "@/components/admin/messages/client"
import BounceWrapper from "@/components/shared/bounce"

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
        <DynamicBreadcrumb items={messagesItems} />
        <MessagesClient isAdmin />
      </BounceWrapper>
    </ContentLayout>
  )
}
