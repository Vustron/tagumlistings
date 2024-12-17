"use client"

// components
import { BathIcon, BedDouble, MapPinHouse, Square } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// hooks
import { useRouter } from "next-nprogress-bar"
import { useState, useEffect } from "react"

// utils
import { placeholderImage, formatPriceToPHP } from "@/lib/utils"
import { motion } from "framer-motion"
import Image from "next/image"

// types
import type { Property } from "@/lib/types"

const PropertyCard = ({
  id,
  propertyPics,
  category,
  location,
  status,
  price,
  no_of_bedrooms,
  no_of_bathrooms,
  square_meter,
  created_at,
}: Property) => {
  const router = useRouter()
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(true)

  const imageUrl =
    propertyPics && propertyPics.length > 0
      ? propertyPics[currentImageIndex]?.url
      : placeholderImage(category || "Property")

  const handleViewProperty = () => {
    router.push(`/properties/${id}`)
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (propertyPics && propertyPics.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % propertyPics.length)
    }
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (propertyPics && propertyPics.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? propertyPics.length - 1 : prev - 1,
      )
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  useEffect(() => {
    setIsImageLoading(true)
  }, [currentImageIndex])

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative overflow-hidden rounded-lg shadow-md group"
    >
      <Card className="relative bg-white dark:bg-zinc-800 hover:shadow-xl transition-shadow duration-300">
        <motion.div
          className="relative w-full h-56"
          variants={{
            rest: { opacity: 1 },
            hover: { opacity: 0.9 },
          }}
          transition={{ duration: 0.3 }}
        >
          {!isImageLoaded ||
            (isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse">
                <span className="text-gray-500 dark:text-gray-400">
                  Loading...
                </span>
              </div>
            ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isImageLoading ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={imageUrl || placeholderImage(category || "Property")}
              alt={`${category || "Property"} Image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              loading="lazy"
              quality={80}
              onLoad={() => {
                setIsImageLoading(false)
                setIsImageLoaded(true)
              }}
              onError={() => setIsImageLoading(false)}
            />
          </motion.div>
          {propertyPics && propertyPics.length > 1 && (
            <>
              <motion.button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Previous image"
              >
                ←
              </motion.button>
              <motion.button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Next image"
              >
                →
              </motion.button>
            </>
          )}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-2 right-2 bg-white dark:bg-zinc-800 px-2 py-1 rounded-full text-xs font-semibold"
          >
            {currentImageIndex + 1} / {propertyPics?.length || 0}
          </motion.div>
        </motion.div>

        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-black dark:text-white text-xl">
              {category?.toLocaleUpperCase() || "No Category"}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === "sold"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : status === "reserved"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              }`}
            >
              {status === "sold"
                ? "Sold"
                : status === "reserved"
                  ? "Reserved"
                  : "Available"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPinHouse className="size-4" />
                <span>{location || "Location not available"}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <BedDouble className="size-4" />
                <span>{no_of_bedrooms || "N/A"} beds</span>
              </div>
              <div className="flex items-center gap-1">
                <BathIcon className="size-4" />
                <span>{no_of_bathrooms || "N/A"} baths</span>
              </div>
              <div className="flex items-center gap-1">
                <Square className="size-4" />
                <span>{square_meter || "N/A"} m²</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Listed on {formatDate(created_at)}
              </p>
              <Button
                onClick={handleViewProperty}
                className="bg-green-600 hover:bg-green-700 text-white"
                aria-label={`View property in ${location}`}
              >
                View Details
              </Button>
            </div>
            <div className="text-lg font-bold text-black dark:text-white">
              {formatPriceToPHP(price || "0")}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default PropertyCard
