"use client"

// components
import ImageCarousel from "@/components/client/property-id/image-carousel"
import FallbackBoundary from "@/components/shared/fallback-boundary"
import { Badge } from "@/components/ui/badge"

// hooks
import { useGetProperty } from "@/lib/hooks/property/get"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

// utils
import { placeholderImage, getRoleBadgeColor } from "@/lib/utils"

// types
import type { Property } from "@/lib/types"

export default function PropertyIdPage() {
  const params = useParams()
  const id = params?.id as string
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const { data, isLoading } = useGetProperty(id)

  useEffect(() => {
    if (data) {
      setProperty(data)
      setLoading(false)
    }
  }, [data])

  if (isLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 w-3/4 mb-4 animate-pulse" />
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        <div className="space-y-2 mt-4">
          <div className="h-6 bg-gray-200 w-1/2 animate-pulse" />
          <div className="h-6 bg-gray-200 w-1/3 animate-pulse" />
          <div className="h-6 bg-gray-200 w-1/4 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="text-center py-16 text-xl font-semibold">
        Property not found
      </div>
    )
  }

  const images = property.propertyPics?.length
    ? property.propertyPics
    : [{ url: placeholderImage("No Images Available") }]

  return (
    <FallbackBoundary>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ImageCarousel images={images} />
        <div className="mt-4 space-y-2">
          <p className="text-xl">
            <strong>Category:</strong>{" "}
            {property.category?.toLocaleUpperCase() || "Property"}
          </p>
          <p className="text-xl">
            <strong>Location:</strong> {property.location || "Unknown"}
          </p>
          <p className="text-xl">
            <strong className="mr-2">Status:</strong>
            <Badge
              className={`${getRoleBadgeColor(property.status || "Unavailable")} font-medium`}
            >
              {property.status || "Unavailable"}
            </Badge>
          </p>
        </div>
      </div>
    </FallbackBoundary>
  )
}
