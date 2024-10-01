// components
import AddPropertyClient from "@/components/admin/new-property/client"
import DynamicBreadcrumb from "@/components/shared/dynamic-breadcrumb"
import BounceWrapper from "@/components/shared/bounce"

// utils
import { addPaymentItems } from "@/lib/misc/breadcrumb-lists"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Add Payment",
}

export default function AddPaymentClientPage() {
  return (
    <BounceWrapper>
      {/* breadcrumb */}
      <DynamicBreadcrumb items={addPaymentItems} />

      {/* client */}
      <AddPropertyClient />
    </BounceWrapper>
  )
}
