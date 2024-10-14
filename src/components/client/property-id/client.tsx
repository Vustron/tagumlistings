"use client"

// components
import {
  Bath,
  Clock,
  Square,
  Calendar,
  BedDouble,
  MapPinHouse,
} from "lucide-react"
import PropertyMetric from "@/components/client/property-id/property-metric"
import ImageCarousel from "@/components/client/property-id/image-carousel"
import FallbackBoundary from "@/components/shared/fallback-boundary"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// hooks
import { useUpdateProperty } from "@/lib/hooks/property/update"
import { useSession } from "@/components/providers/session"
import { useUpdateAccount } from "@/lib/hooks/auth/update"
import { useGetProperty } from "@/lib/hooks/property/get"
import { useState, useEffect } from "react"

// utils
import {
  placeholderImage,
  getRoleBadgeColor,
  clientErrorHandler,
} from "@/lib/utils"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

// types
import type { Property } from "@/lib/types"

const PropertyIdClient = ({ id }: { id: string }) => {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [reservationStatus, setReservationStatus] = useState<
    "idle" | "success" | "error"
  >("idle")
  const { data, isLoading } = useGetProperty(id)
  const session = useSession()
  const updateAccount = useUpdateAccount(session?.id)
  const updateProperty = useUpdateProperty(property?.id)

  useEffect(() => {
    if (data) {
      setProperty(data)
      setLoading(false)
    }
  }, [data])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
        </div>
      </div>
    )
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

  const handleReserve = async () => {
    if (!session) {
      toast.error("Please log in to reserve a property")
      return
    }

    try {
      const updatedReservedProperties = [
        ...(session.reservedProperties || []),
        { id: property?.id },
      ].filter((prop) => prop.id) as { id: string }[]

      await toast.promise(
        Promise.all([
          updateAccount.mutateAsync({
            id: session.id,
            name: session.name,
            email: session.email,
            contact_number: session.contact_number,
            reservedProperties: updatedReservedProperties,
          }),
          updateProperty.mutateAsync({
            id: property?.id,
            category: property?.category,
            location: property?.location,
            status: "reserved",
            propertyPics: property?.propertyPics,
            no_of_bedrooms: property?.no_of_bedrooms,
            no_of_bathrooms: property?.no_of_bathrooms,
            square_meter: property?.square_meter,
          }),
        ]),
        {
          loading: <span className="animate-pulse">Reserving property...</span>,
          success: "Property reserved successfully!",
          error: (error: unknown) => clientErrorHandler(error),
        },
      )

      setReservationStatus("success")
    } catch (error) {
      setReservationStatus("error")
    }
  }

  const isPropertyReserved = session?.reservedProperties?.some(
    (reservedProperty) => reservedProperty.id === property.id,
  )

  return (
    <FallbackBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <div className="mb-6">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-gray-100"
          >
            Property Details
          </motion.h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              className={`${getRoleBadgeColor(property.status || "Unavailable")} text-sm`}
            >
              {property.status || "Unavailable"}
            </Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ID: {property.id}
            </span>
          </div>
        </div>

        <Card className="overflow-hidden bg-white dark:bg-zinc-800 shadow-lg rounded-xl">
          <ImageCarousel
            images={images}
            aspectRatio="video"
            showThumbnails={true}
            autoPlay={true}
            interval={5000}
          />

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Property Information
                </h2>

                <div className="space-y-3">
                  <PropertyMetric
                    icon={BedDouble}
                    label="Bedrooms"
                    value={property.no_of_bedrooms}
                  />
                  <PropertyMetric
                    icon={Bath}
                    label="Bathrooms"
                    value={property.no_of_bathrooms}
                  />
                  <PropertyMetric
                    icon={Square}
                    label="Area"
                    value={`${property.square_meter} m²`}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Location & Timing
                </h2>

                <div className="space-y-3">
                  <PropertyMetric
                    icon={MapPinHouse}
                    label="Location"
                    value={property.location}
                  />

                  <PropertyMetric
                    icon={Calendar}
                    label="Listed on"
                    value={formatDate(property.created_at)}
                  />

                  <PropertyMetric
                    icon={Clock}
                    label="Last updated"
                    value={formatDate(property.updated_at)}
                  />
                </div>
              </div>
            </div>

            {property.appointment_id && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200">
                  This property has an active appointment (ID:{" "}
                  {property.appointment_id})
                </p>
              </div>
            )}

            <div className="mt-6">
              <Button
                onClick={handleReserve}
                disabled={
                  property.status !== "available" ||
                  updateAccount.isPending ||
                  reservationStatus === "success" ||
                  isPropertyReserved
                }
                className="dark:hover:bg-green-400 w-full bg-green-600 dark:bg-green-600 text-white"
              >
                {updateAccount.isPending
                  ? "Processing..."
                  : reservationStatus === "success" || isPropertyReserved
                    ? "Property Reserved"
                    : "Reserve Property"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </FallbackBoundary>
  )
}

export default PropertyIdClient
