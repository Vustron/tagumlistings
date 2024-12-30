// components
import PropertiesClient from "@/components/client/properties/client"
import QueryHydrator from "@/components/shared/query-hydrator"

// actions
import { preFetchProperties } from "@/lib/actions/property/get-all"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Properties",
}

export default async function Properties() {
  const [, fetchAccount, fetchProperties] = await Promise.all([
    getSession(),
    preFetchAccount((await getSession()).id!),
    preFetchProperties(),
  ])
  return (
    <QueryHydrator prefetchFns={[fetchAccount, fetchProperties]}>
      <div className="font-sans min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white">
        <main className="mx-auto pt-8 pb-16 max-w-7xl px-4 relative z-10">
          <PropertiesClient />
        </main>
      </div>
    </QueryHydrator>
  )
}
