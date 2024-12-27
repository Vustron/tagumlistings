// components
import RecordsClient from "@/components/client/records/client"
import BounceWrapper from "@/components/shared/bounce"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Records",
}

export default function ClientRecordsPage() {
  return (
    <div className="container p-10">
      <BounceWrapper>
        <RecordsClient />
      </BounceWrapper>
    </div>
  )
}
