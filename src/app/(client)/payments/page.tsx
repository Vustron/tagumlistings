// components
import PaymentsClient from "@/app/(client)/_components/payments/client"
import BounceWrapper from "@/components/shared/bounce"

// utils
import { payments } from "@/app/(admin)/_components/data/payments"

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
