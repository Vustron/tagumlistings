// components
import ReservedPropertiesClient from "@/app/(client)/_components/reserved/client"
import BounceWrapper from "@/components/shared/bounce"

// utils
import { properties } from "@/app/(admin)/_components/data/properties"

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
        <ReservedPropertiesClient data={properties} />
      </BounceWrapper>
    </div>
  )
}
