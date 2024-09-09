// components
import PaymentsClient from "@/app/(client)/payments/_components/client"
import BounceWrapper from "@/components/shared/bounce"

// utils
import { payments } from "@/app/(admin)/admin/payments/constants"

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
        {/* client */}
        <PaymentsClient data={payments} />
      </BounceWrapper>
    </div>
  )
}
