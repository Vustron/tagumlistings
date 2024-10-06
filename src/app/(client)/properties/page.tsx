// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import PropertiesClient from "@/components/client/properties/client"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Properties",
}

export default async function Properties() {
  return (
    <HydrationBoundaryWrapper>
      <div className="font-sans min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white">
        <main className="mx-auto pt-8 pb-16 max-w-7xl px-4 relative z-10">
          <PropertiesClient />
        </main>
      </div>
    </HydrationBoundaryWrapper>
  )
}
