"use client"

// components
import { Button } from "@/components/ui/button"

// utils
import { motion } from "framer-motion"
import Image from "next/image"
import React from "react"

interface CarouselThumbnailsProps {
  validImages: { url: string }[]
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
  setDirection: React.Dispatch<React.SetStateAction<number>>
  setIsImageLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

const CarouselThumbnails = ({
  validImages,
  currentIndex,
  setCurrentIndex,
  setDirection,
  setIsImageLoaded,
}: CarouselThumbnailsProps) => {
  return (
    <motion.div
      className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {validImages.map((image, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden cursor-pointer ${
            index === currentIndex
              ? "ring-2 ring-green-500 border-2 border-green-500"
              : "opacity-70 hover:opacity-100"
          }`}
        >
          <Button
            className="p-0 w-full h-full"
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
              setIsImageLoaded(false)
            }}
            aria-label={`Go to image ${index + 1}`}
          >
            <Image
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              width={64}
              height={64}
              className="object-cover transition-all duration-200"
            />
          </Button>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default React.memo(CarouselThumbnails)
