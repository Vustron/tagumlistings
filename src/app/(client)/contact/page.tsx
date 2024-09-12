// components
import MessagesClient from "@/app/(admin)/_components/messages/client"
import BounceWrapper from "@/components/shared/bounce"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Messages",
}

export default function ClientMessagesPage() {
  return (
    <div className="container p-5">
      <BounceWrapper>
        {/* client */}
        <MessagesClient />
      </BounceWrapper>
    </div>
  )
}
