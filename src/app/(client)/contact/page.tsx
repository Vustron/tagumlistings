// components
import MessagesClient from "@/components/admin/messages/client"
import QueryHydrator from "@/components/shared/query-hydrator"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchAccounts } from "@/lib/actions/auth/get-all"
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Contact",
}

export default async function ClientMessagesPage() {
  const [, fetchAccount, fetchAccounts] = await Promise.all([
    getSession(),
    preFetchAccount((await getSession()).id!),
    preFetchAccounts(),
  ])
  return (
    <QueryHydrator prefetchFns={[fetchAccount, fetchAccounts]}>
      <div className="container">
        <BounceWrapper>
          <MessagesClient />
        </BounceWrapper>
      </div>
    </QueryHydrator>
  )
}
