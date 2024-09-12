// components
import AppointmentsClient from "@/app/(client)/_components/appointments/client"
import BounceWrapper from "@/components/shared/bounce"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Appointments",
}

export default function AppointmentsClientPage() {
  return (
    <div className="container p-5">
      <BounceWrapper>
        {/* client */}

        <AppointmentsClient />
      </BounceWrapper>
    </div>
  )
}
