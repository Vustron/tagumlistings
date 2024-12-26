"use client"

import PropertyDetails from "@/components/client/property-id/property-details"
import PropertySkeleton from "@/components/client/property-id/skeleton"
import FallbackBoundary from "@/components/shared/fallback-boundary"

import { useQueryClientPropertyData } from "@/lib/actions/property/query-client-property"
import { useSession } from "@/components/providers/session"
import { useUpdateAccount } from "@/lib/hooks/auth/update"
import { useState } from "react"

const PropertyIdClient = ({ id }: { id: string }) => {
  const [reservationStatus] = useState<
    "idle" | "success" | "error" | "pending"
  >("idle")
  const session = useSession()
  const updateAccount = useUpdateAccount(session?.id)
  const { property, filteredAppointments, appointmentDates, images } =
    useQueryClientPropertyData(id, session?.name)

  if (!property) {
    return <PropertySkeleton />
  }

  const isPropertyReserved = session?.reservedProperties?.some(
    (reservedProperty) => reservedProperty.id === property.id,
  )

  return (
    <FallbackBoundary>
      <PropertyDetails
        property={property}
        images={images}
        reservationStatus={reservationStatus}
        updateAccount={updateAccount}
        isPropertyReserved={isPropertyReserved!}
        appointments={filteredAppointments}
        appointmentDates={appointmentDates}
        isOnClientAppointments
        session={session}
      />
    </FallbackBoundary>
  )
}

export default PropertyIdClient
