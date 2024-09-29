// components
import PaymentsClient from "@/app/(client)/_components/payments/client"
import BounceWrapper from "@/components/shared/bounce"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Payments",
}

export default function ClientPaymentsPage() {
  return (
    <div className="container p-5">
      <BounceWrapper>
        <PaymentsClient data={[]} />
      </BounceWrapper>
    </div>
  )
}
