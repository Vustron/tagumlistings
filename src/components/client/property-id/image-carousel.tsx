"use client"

// components
import CarouselThumbnails from "@/components/client/property-id/carousel-thumbnail"
import CarouselContent from "@/components/client/property-id/carousel-content"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

// hooks
import { useState, useMemo, useEffect, useCallback } from "react"

// utils
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

  return (
    <div className="space-y-4">
      <CarouselContent
        validImages={validImages}
        currentIndex={currentIndex}
        direction={direction}
        isImageLoaded={isImageLoaded}
        setIsImageLoaded={setIsImageLoaded}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        aspectRatio={aspectRatio}
        setIsPaused={setIsPaused}
        handleTouchStart={handleTouchStart}
        handleTouchEnd={handleTouchEnd}
        setIsFullscreen={setIsFullscreen}
        isFullscreen={isFullscreen}
      />

      {showThumbnails && (
        <CarouselThumbnails
          validImages={validImages}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          setDirection={setDirection}
          setIsImageLoaded={setIsImageLoaded}
        />
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
            <CarouselContent
              validImages={validImages}
              currentIndex={currentIndex}
              direction={direction}
              isImageLoaded={isImageLoaded}
              setIsImageLoaded={setIsImageLoaded}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              aspectRatio={aspectRatio}
              setIsPaused={setIsPaused}
              handleTouchStart={handleTouchStart}
              handleTouchEnd={handleTouchEnd}
              setIsFullscreen={setIsFullscreen}
              isFullscreen={isFullscreen}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default React.memo(ImageCarousel)
