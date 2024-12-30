"use client"

import PropertyDetails from "@/components/client/property-id/property-details"
import PropertySkeleton from "@/components/client/property-id/skeleton"
import FallbackBoundary from "@/components/shared/fallback-boundary"

import { useGetAppointmentDates } from "@/lib/hooks/appointment/get-dates"
import { useGetAppointments } from "@/lib/hooks/appointment/get-all"
import { useSession } from "@/components/providers/session"
import { useUpdateAccount } from "@/lib/hooks/auth/update"
import { useGetProperty } from "@/lib/hooks/property/get"
import { useState } from "react"

import { placeholderImage } from "@/lib/utils"

import type { Appointment } from "@/lib/types"

const PropertyIdClient = ({ id }: { id: string }) => {
  const [reservationStatus] = useState<
    "idle" | "success" | "error" | "pending"
  >("idle")
  const session = useSession()
  const updateAccount = useUpdateAccount(session?.id)
  const { data: property } = useGetProperty(id)
  const { data } = useGetAppointments()
  const filteredAppointments =
    data?.appointments?.filter(
      (appointment: Appointment) => appointment.user === session?.name,
    ) ?? []
  const { data: appointmentDates } = useGetAppointmentDates()

  if (!property) {
    return <PropertySkeleton />
  }

  const isPropertyReserved = session?.reservedProperties?.some(
    (reservedProperty) => reservedProperty.id === property.id,
  )
  const images = property?.propertyPics?.length
    ? property.propertyPics
    : [{ url: placeholderImage("No Images Available") }]

  return (
    <FallbackBoundary>
      <PropertyDetails
        property={property}
        images={images}
        reservationStatus={reservationStatus}
        updateAccount={updateAccount}
        isPropertyReserved={isPropertyReserved!}
        appointments={filteredAppointments}
        appointmentDates={appointmentDates.dates}
        isOnClientAppointments
        session={session}
      />
    </FallbackBoundary>
  )
}

export default PropertyIdClient
