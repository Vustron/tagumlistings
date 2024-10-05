// components
import ReservedPropertiesClient from "@/components/client/reserved/client"
import BounceWrapper from "@/components/shared/bounce"

// utils

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Reserved Properties",
}

export default function ReservedPropertiesPage() {
  return (
    <div className="container p-5">
      <BounceWrapper>
        {/* client */}
        <ReservedPropertiesClient />
      </BounceWrapper>
    </div>
  )
}
