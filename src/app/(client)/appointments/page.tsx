// components
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import AppointmentsClient from "@/components/client/appointments/client"
import BounceWrapper from "@/components/shared/bounce"

// actions
import { getSession } from "@/lib/actions/session/get"

// utils
import { dataSerializer } from "@/lib/utils"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Appointments",
}

export default async function AppointmentsClientPage() {
  // get session
  const session = await getSession()

  // session serialize
  const userData = dataSerializer(session)

  return (
    <HydrationBoundaryWrapper accountId={userData.id}>
      <div className="container p-5">
        <BounceWrapper>
          <AppointmentsClient />
        </BounceWrapper>
      </div>
    </HydrationBoundaryWrapper>
  )
}
