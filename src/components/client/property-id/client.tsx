"use client"

// components
import PropertyMetric from "@/components/client/property-id/property-metric"
import ImageCarousel from "@/components/client/property-id/image-carousel"
import { Bath, BedDouble, Calendar, Clock, Square } from "lucide-react"
import FallbackBoundary from "@/components/shared/fallback-boundary"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

// hooks
import { useGetProperty } from "@/lib/hooks/property/get"
import { useState, useEffect } from "react"

// utils
import { placeholderImage, getRoleBadgeColor } from "@/lib/utils"

// types
import type { Property } from "@/lib/types"
import { motion } from "framer-motion"

const PropertyIdClient = ({ id }: { id: string }) => {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const { data, isLoading } = useGetProperty(id)

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
            {property.category?.toLocaleUpperCase() || "Property"} Details
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
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <span className="mt-1">📍</span>
                    <span className="font-medium">Location:</span>
                    <span className="flex-1">
                      {property.location || "Location not specified"}
                    </span>
                  </div>

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
          </CardContent>
        </Card>
      </motion.div>
    </FallbackBoundary>
  )
}

export default PropertyIdClient
