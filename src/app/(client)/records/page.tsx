// components
import QueryHydrator from "@/components/shared/query-hydrator"
import RecordsClient from "@/components/client/records/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchPayments } from "@/lib/actions/payment/get-all"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Records",
}

export default async function ClientRecordsPage() {
  const [, fetchAccount, fetchPayments] = await Promise.all([
    getSession(),
    preFetchAccount((await getSession()).id!),
    preFetchPayments(),
  ])
  return (
    <QueryHydrator prefetchFns={[fetchAccount, fetchPayments]}>
      <div className="container p-10">
        <BounceWrapper>
          <RecordsClient />
        </BounceWrapper>
      </div>
    </QueryHydrator>
  )
}
