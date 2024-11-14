// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import PropertyIdClient from "@/components/client/property-id/client"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Property",
}

export default async function PropertyIdPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <HydrationBoundaryWrapper propertyId={params.id}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PropertyIdClient id={params.id} />
      </div>
    </HydrationBoundaryWrapper>
  )
}
