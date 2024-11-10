"use client"

// components
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"

// utils
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import React from "react"

interface CarouselContentProps {
  validImages: { url: string }[]
  currentIndex: number
  direction: number
  isImageLoaded: boolean
  setIsImageLoaded: React.Dispatch<React.SetStateAction<boolean>>
  handleNext: () => void
  handlePrevious: () => void
  aspectRatio: "square" | "video" | "wide"
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>
  handleTouchStart: (e: React.TouchEvent) => void
  handleTouchEnd: (e: React.TouchEvent) => void
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>
}

const CarouselContent = ({
  validImages,
  currentIndex,
  direction,
  isImageLoaded,
  setIsImageLoaded,
  handleNext,
  handlePrevious,
  aspectRatio,
  setIsPaused,
  handleTouchStart,
  handleTouchEnd,
  setIsFullscreen,
}: CarouselContentProps) => {
  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
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

  return (
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
}

export default React.memo(CarouselContent)
