// components
import QueryHydrator from "@/components/shared/query-hydrator"
import AccountClient from "@/components/client/account/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { preFetchAccount } from "@/lib/actions/auth/get"
import { getSession } from "@/lib/actions/session/get"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Account",
}

export default async function ClientAccountPage() {
  const [session, fetchAccount] = await Promise.all([
    getSession(),
    preFetchAccount((await getSession()).id!),
  ])
  return (
    <QueryHydrator prefetchFns={[fetchAccount]}>
      <BounceWrapper>
        <AccountClient id={session.id} />
      </BounceWrapper>
    </QueryHydrator>
  )
}
