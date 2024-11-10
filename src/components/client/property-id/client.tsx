"use client"

// components
import PropertyDetails from "@/components/client/property-id/property-details"
import PropertySkeleton from "@/components/client/property-id/skeleton"
import FallbackBoundary from "@/components/shared/fallback-boundary"
import { motion } from "framer-motion"

// hooks
import { useGetAppointmentDates } from "@/lib/hooks/appointment/get-dates"
import { useGetAppointments } from "@/lib/hooks/appointment/get-all"
import { useSession } from "@/components/providers/session"
import { useUpdateAccount } from "@/lib/hooks/auth/update"
import { useGetProperty } from "@/lib/hooks/property/get"
import { useState, useEffect, useMemo } from "react"

// utils
import { placeholderImage } from "@/lib/utils"

// types
import type { Appointment, Property } from "@/lib/types"

const PropertyIdClient = ({ id }: { id: string }) => {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [reservationStatus] = useState<
    "idle" | "success" | "error" | "pending"
  >("idle")
  const { data, isLoading } = useGetProperty(id)
  const session = useSession()
  const updateAccount = useUpdateAccount(session?.id)
  const { data: appointmentsData } = useGetAppointments()
  const { data: datesData } = useGetAppointmentDates()

  const filteredAppointments = useMemo(() => {
    return appointmentsData.appointments.filter((appointment: Appointment) => {
      return appointment.user === session.name
    })
  }, [appointmentsData.appointments, session.name])

  const dates = datesData?.dates ?? []

  useEffect(() => {
    if (data) {
      setProperty(data)
      setLoading(false)
    }
  }, [data])

  if (isLoading || loading) {
    return <PropertySkeleton />
  }

  if (!property) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Property Not Found
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          The property you're looking for doesn't exist or has been removed.
        </p>
      </motion.div>
    )
  }

  const images = property.propertyPics?.length
    ? property.propertyPics
    : [{ url: placeholderImage("No Images Available") }]

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
        appointmentDates={dates}
        isOnClientAppointments
      />
    </FallbackBoundary>
  )
}

export default PropertyIdClient
