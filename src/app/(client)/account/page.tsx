// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import AccountClient from "@/components/client/account/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/lib/actions/session/get"

// utils
import { dataSerializer } from "@/lib/utils"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Account",
}

export default async function ClientAccountPage() {
  // get session
  const session = await getSession()

  // session serialize
  const userData = dataSerializer(session)

  return (
    <HydrationBoundaryWrapper accountId={userData.id}>
      <BounceWrapper>
        <AccountClient id={userData.id} />
      </BounceWrapper>
    </HydrationBoundaryWrapper>
  )
}