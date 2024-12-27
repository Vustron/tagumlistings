"use client"

// components
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

// hooks
import { useState } from "react"

interface ViewImageDialogProps {
  image: string
  index: number
  messageId: string
  onLoad: () => void
  isLoading?: boolean
}

export default function ViewImageDialog({
  image,
  index,
  messageId,
  onLoad,
  isLoading = true,
}: ViewImageDialogProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isDialogImageLoading, setIsDialogImageLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleImageLoad = (type: "thumbnail" | "dialog") => {
    if (type === "thumbnail") {
      setIsImageLoading(false)
      onLoad()
    } else {
      setIsDialogImageLoading(false)
    }
  }

  const handleImageError = () => {
    setError(true)
    setIsImageLoading(false)
    setIsDialogImageLoading(false)
  }

  if (error) {
    return (
      <div className="relative size-48 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
        <span className="text-sm text-muted-foreground">
          Failed to load image
        </span>
      </div>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative size-48 rounded-lg overflow-hidden cursor-pointer mb-4">
          {isImageLoading && (
            <Skeleton className="absolute inset-0 bg-secondary animate-pulse" />
          )}
          <Image
            src={image}
            alt={`Attachment ${index + 1}${messageId}`}
            layout="fill"
            objectFit="cover"
            className={`transition-opacity duration-200 ${
              isLoading && isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => handleImageLoad("thumbnail")}
            onError={handleImageError}
            priority={index === 0}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <div className="relative w-full h-[80vh]">
          {isDialogImageLoading && (
            <Skeleton className="absolute inset-0 bg-secondary animate-pulse" />
          )}
          <Image
            src={image}
            alt={`Attachment ${index + 1}`}
            layout="fill"
            objectFit="contain"
            className={`transition-opacity duration-200 ${
              isDialogImageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => handleImageLoad("dialog")}
            onError={handleImageError}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
