// components
// import AppointmentsClient from "@/app/(client)/_components/appointments/client"
import BounceWrapper from "@/components/shared/bounce"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Appointments",
}

export default async function AppointmentsClientPage() {
  return (
    <div className="container p-5">
      <BounceWrapper>
        <h1 className="text-3xl font-bold">Appointments</h1>
        {/* <AppointmentsClient /> */}
      </BounceWrapper>
    </div>
  )
}
