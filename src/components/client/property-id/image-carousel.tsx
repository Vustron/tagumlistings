"use client"

// components
import {
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// hooks
import { useState, useMemo, useEffect, useCallback } from "react"

// utils
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import React from "react"

interface CarouselProps {
  images: { url: string }[]
  aspectRatio?: "square" | "video" | "wide"
  showThumbnails?: boolean
  autoPlay?: boolean
  interval?: number
}

const ImageCarousel = ({
  images,
  aspectRatio = "video",
  showThumbnails = true,
  autoPlay = false,
  interval = 5000,
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(0)

  const validImages = useMemo(
    () => images?.filter((img): img is { url: string } => !!img.url) ?? [],
    [images],
  )

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
  }

  const handleNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length)
    setIsImageLoaded(false)
  }, [validImages.length])

  const handlePrevious = useCallback(() => {
    setDirection(-1)
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + validImages.length) % validImages.length,
    )
    setIsImageLoaded(false)
  }, [validImages.length])

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isPaused && validImages.length > 1) {
      const timer = setInterval(handleNext, interval)
      return () => clearInterval(timer)
    }
  }, [autoPlay, handleNext, interval, isPaused, validImages.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") handleNext()
      if (event.key === "ArrowLeft") handlePrevious()
      if (event.key === "Escape" && isFullscreen) setIsFullscreen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleNext, handlePrevious, isFullscreen])

  // Touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0]!.clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0]!.clientX
    const difference = touchStart - touchEnd

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        handleNext()
      } else {
        handlePrevious()
      }
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  if (validImages.length === 0) {
    return (
      <div className="w-full h-64 sm:h-96 bg-gray-200 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
        <ImageIcon className="size-12 mb-2" />
        <p>No images available</p>
      </div>
    )
  }

  const CarouselContent = (
    <div
      className={`relative w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 ${
        aspectRatioClasses[aspectRatio]
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse">
              <span className="text-gray-500 dark:text-gray-400">
                Loading...
              </span>
            </div>
          )}
          <Image
            src={validImages[currentIndex]!.url}
            alt={`Property image ${currentIndex + 1}`}
            fill
            quality={100}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
            priority={currentIndex === 0}
            onLoad={() => setIsImageLoaded(true)}
            className={`object-cover transition-opacity duration-300 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </motion.div>
      </AnimatePresence>

      {validImages.length > 1 && (
        <>
          <motion.div
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={handlePrevious}
              className="bg-black/50 hover:bg-black/75 text-white rounded-full transition-colors duration-200"
              size="icon"
              variant="ghost"
              aria-label="Previous Image"
            >
              <ChevronLeft className="size-6" />
            </Button>
          </motion.div>
          <motion.div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={handleNext}
              className="bg-black/50 hover:bg-black/75 text-white rounded-full transition-colors duration-200"
              size="icon"
              variant="ghost"
              aria-label="Next Image"
            >
              <ChevronRight className="size-6" />
            </Button>
          </motion.div>
        </>
      )}

      <div className="absolute top-4 right-4 z-10 space-x-2">
        <Button
          onClick={() => setIsFullscreen(true)}
          className="bg-black/50 hover:bg-black/75 text-white rounded-full transition-colors duration-200"
          size="icon"
          variant="ghost"
          aria-label="View Fullscreen"
        >
          <ZoomIn className="size-5" />
        </Button>
      </div>

      <div className="absolute bottom-4 right-4 z-10">
        <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {validImages.length}
        </span>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {CarouselContent}

      {showThumbnails && (
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
      )}

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden">
          <div className="relative">
            <Button
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/75 text-white rounded-full"
              size="icon"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="size-5" />
            </Button>
            {CarouselContent}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default React.memo(ImageCarousel)
