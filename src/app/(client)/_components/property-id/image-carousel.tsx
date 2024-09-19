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
  images: { url: string }[]
}

const ImageCarousel = ({ images }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const validImages = useMemo(
    () => images?.filter((img): img is { url: string } => !!img.url) ?? [],
    [images],
  )

  const handleNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length)
  }, [validImages.length])

  const handlePrevious = useCallback(() => {
    setDirection(-1)
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

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  if (validImages.length === 0) {
    return (
      <div className="w-full h-64 sm:h-96 bg-gray-200 flex items-center justify-center text-gray-500">
        No images available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full h-64 sm:h-96 overflow-hidden rounded-lg bg-gray-100">
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
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)

              if (swipe < -swipeConfidenceThreshold) {
                handleNext()
              } else if (swipe > swipeConfidenceThreshold) {
                handlePrevious()
              }
            }}
            className="absolute inset-0"
          >
            <Image
              src={validImages[currentIndex]!.url}
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
            <motion.div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                onClick={handlePrevious}
                className="bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-colors duration-200"
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
                className="bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-colors duration-200"
                size="icon"
                variant="ghost"
                aria-label="Next Image"
              >
                <ChevronRight className="size-6" />
              </Button>
            </motion.div>
          </>
        )}
      </div>

      <motion.div
        className="flex space-x-2 overflow-x-auto p-1 scrollbar-hide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {validImages.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 w-14 sm:w-16 h-14 sm:h-16 rounded-md overflow-hidden ${
              index === currentIndex
                ? "ring-2 ring-green-500 border-2 border-green-500"
                : "bg-gray-200"
            }`}
            style={{ aspectRatio: "1/1" }}
          >
            <Button
              className="p-0 w-full h-full"
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              aria-label={`Go to image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                width={64}
                height={64}
                quality={100}
                loading={index === currentIndex ? "eager" : "lazy"}
                className="object-cover transition-all duration-200 hover:opacity-80"
              />
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default React.memo(ImageCarousel)
