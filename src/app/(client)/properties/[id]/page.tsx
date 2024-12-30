// components
import PropertyIdClient from "@/components/client/property-id/client"
import QueryHydrator from "@/components/shared/query-hydrator"

// actions
import { preFetchAccounts } from "@/lib/actions/auth/get-all"
import { preFetchProperty } from "@/lib/actions/property/get"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

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
  const [, fetchAccount, fetchAccounts, fetchProperty, resolvedParams] =
    await Promise.all([
      getSession(),
      preFetchAccount((await getSession()).id!),
      preFetchAccounts(),
      preFetchProperty((await params).id),
      params,
    ])
  const { id } = resolvedParams
  return (
    <QueryHydrator prefetchFns={[fetchAccount, fetchAccounts, fetchProperty]}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PropertyIdClient id={id} />
      </div>
    </QueryHydrator>
  )
}
