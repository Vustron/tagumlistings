"use client"

// components
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// hooks
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

// utils
import { placeholderImage } from "@/lib/utils"
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
}: Property) => {
  const router = useRouter()
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const imageUrl =
    propertyPics && propertyPics.length > 0
      ? propertyPics[0]?.url
      : placeholderImage(category || "Property")

  const handleViewProperty = () => {
    router.push(`/properties/${id}`)
  }

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative overflow-hidden rounded-lg shadow-md group"
    >
      <Card className="relative bg-white dark:bg-zinc-800">
        <motion.div
          className="relative w-full h-48"
          variants={{
            rest: { opacity: 1 },
            hover: { opacity: 0.8 },
          }}
          transition={{ duration: 0.3 }}
        >
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <span>Loading...</span>
            </div>
          )}
          <Image
            src={imageUrl || placeholderImage(category || "Property")}
            alt={category || "Property Image"}
            width={500}
            height={500}
            className={`object-cover size-full ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            placeholder="blur"
            blurDataURL={placeholderImage(category || "Property")}
            onLoad={() => setIsImageLoaded(true)}
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          variants={{
            rest: { opacity: 0, y: 20 },
            hover: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          <Button
            className="-mt-20 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={handleViewProperty}
            aria-label={`View property in ${location}`}
          >
            View Property
          </Button>
        </motion.div>

        <CardContent className="p-4 text-center">
          <h3 className="font-bold text-black dark:text-white text-lg mb-2">
            {category?.toLocaleUpperCase() || "No Category"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            {location || "Location not available"}
          </p>
          <p
            className={`text-lg font-bold ${status === "sold" ? "text-red-500" : "text-green-500"}`}
          >
            {status === "sold" ? "Sold" : "Available"}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default PropertyCard
