// components
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// hooks
import { useState, useMemo, useEffect, useCallback } from "react"

// utils
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import React from "react"

interface CarouselProps {
  images: string[]
}

const ImageCarousel = ({ images }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const validImages = useMemo(
    () => images?.filter((img): img is string => typeof img === "string") ?? [],
    [images],
  )

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length)
  }, [validImages.length])

  const handlePrevious = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + validImages.length) % validImages.length,
    )
  }, [validImages.length])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") handleNext()
      if (event.key === "ArrowLeft") handlePrevious()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleNext, handlePrevious])

  if (validImages.length === 0) {
    return (
      <div className="w-full h-64 sm:h-96 bg-gray-200 flex items-center justify-center">
        No images available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full h-64 sm:h-96 overflow-hidden rounded-lg">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={validImages[currentIndex]!}
              alt={`Property image ${currentIndex + 1}`}
              layout="fill"
              objectFit="cover"
              quality={100}
              sizes="100vw"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {validImages.length > 1 && (
          <>
            <Button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50  p-2 rounded-full hover:bg-gray-800"
              aria-label="Previous Image"
            >
              <ChevronLeft className="text-white " size={24} />
            </Button>
            <Button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50  p-2 rounded-full hover:bg-gray-800"
              aria-label="Next Image"
            >
              <ChevronRight className="text-white" size={24} />
            </Button>
          </>
        )}
      </div>

      <div className="flex space-x-2 overflow-x-auto p-1">
        {validImages.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 w-14 sm:w-16 h-14 sm:h-16 rounded-md overflow-hidden ${
              index === currentIndex
                ? "ring-2 ring-green-500 border-2 border-green-500 bg-blue-50"
                : "bg-gray-200"
            }`}
            style={{ aspectRatio: "1/1" }}
          >
            <Button
              className="p-0 w-full h-full"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                width={64}
                height={64}
                quality={100}
                loading={index === currentIndex ? "eager" : "lazy"}
                className="object-cover"
              />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(ImageCarousel)
