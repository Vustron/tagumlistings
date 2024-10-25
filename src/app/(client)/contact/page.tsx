// components
import MessagesClient from "@/components/admin/messages/client"
import BounceWrapper from "@/components/shared/bounce"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Contact",
}

export default function ClientMessagesPage() {
  return (
    <div className="container p-10">
      <BounceWrapper>
        {/* client */}
        <MessagesClient />
      </BounceWrapper>
    </div>
  )
}
