"use client"

// components
import ImageCarousel from "@/app/(client)/_components/property-id/image-carousel"

// hooks
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

// utils
import { properties } from "@/app/(admin)/_components/data/properties"

// types

export default async function PropertyIdPage() {
  const params = useParams()
  const id = params?.id as string
  const [property, setProperty] = useState<(typeof properties)[0] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperty = () => {
      const foundProperty = properties.find((p) => p.id === id)
      setProperty(foundProperty ?? null)
      setLoading(false)
    }

    fetchProperty()
  }, [id])

  if (loading) {
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
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{property.category}</h1>
      <ImageCarousel images={property.propertyPics!} />
      <div className="mt-4 space-y-2">
        <p className="text-xl">
          <strong>Location:</strong> {property.location}
        </p>
        <p className="text-xl">
          <strong>Status:</strong> {property.status}
        </p>
        <p className="text-xl">
          <strong>ID:</strong> {property.id}
        </p>
        {property.created_at && (
          <p className="text-sm text-gray-500">
            Created: {new Date(property.created_at).toLocaleDateString()}
          </p>
        )}
        {property.updated_at && (
          <p className="text-sm text-gray-500">
            Last updated: {new Date(property.updated_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  )
}
