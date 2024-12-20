// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import PropertyIdClient from "@/components/client/property-id/client"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Property",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyIdPage({ params }: PageProps) {
  const { id } = await params
  return (
    <HydrationBoundaryWrapper propertyId={id}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PropertyIdClient id={id} />
      </div>
    </HydrationBoundaryWrapper>
  )
}
