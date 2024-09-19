"use client"

// components
import { ImagePlus, Loader, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// utils
import {
  ref,
  deleteObject,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage"
import { firebaseStorage } from "@/lib/config/firebase"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import Image from "next/image"

// hooks
import useMounted from "@/lib/hooks/use-mounted"
import { useState, useCallback } from "react"

interface ImageUploadProps {
  onChange: (value: string[]) => void
  onRemove: (value: string) => void
  value: string[]
}

const ImageUpload = ({ onChange, onRemove, value }: ImageUploadProps) => {
  const [progress, setProgress] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isMounted = useMounted()

  const onUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files: File[] = Array.from(e.target.files || [])
      setIsLoading(true)
      const newUrls: string[] = []
      let completedUploads = 0

      for (const file of files) {
        const uploadTask = uploadBytesResumable(
          ref(firebaseStorage, `Images/Properties/${Date.now()}-${file.name}`),
          file,
          { contentType: file.type },
        )

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          },
          (error) => {
            toast.error(error.message)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
              newUrls.push(downloadUrl)
              completedUploads++

              if (completedUploads === files.length) {
                setIsLoading(false)
                onChange([...value, ...newUrls])
              }
            })
          },
        )
      }
    },
    [onChange, value],
  )

  const onDelete = useCallback(
    (url: string) => {
      const newValue = value.filter((imageUrl) => imageUrl !== url)

      onRemove(url)
      onChange(newValue)

      deleteObject(ref(firebaseStorage, url))
        .then(() => {
          toast.success("Image removed")
        })
        .catch((error) => {
          console.error("Error removing image:", error)
          toast.error("Failed to remove image")
        })
    },
    [onChange, onRemove, value],
  )

  if (!isMounted) {
    return null
  }

  return (
    <div className="w-auto">
      <AnimatePresence>
        {value && value.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {value.map((url) => (
              <motion.div
                key={url}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-square overflow-hidden rounded-md"
              >
                <Image
                  fill
                  className="object-cover"
                  alt="Uploaded Image"
                  src={url}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <motion.div
                  className="absolute right-2 top-2 z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(url)}
                    type="button"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex aspect-square w-full max-w-[25rem] h-[150px] flex-col items-center justify-center gap-3 overflow-hidden rounded-md border-2 border-dashed border-gray-200"
      >
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <Loader className="h-6 w-6 animate-spin" />
            <span className="mt-2 text-sm">{`${progress.toFixed(2)}%`}</span>
          </motion.div>
        ) : (
          <Label className="size-full cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex size-full flex-col items-center justify-center gap-2"
            >
              <ImagePlus className="h-6 w-6" />
              <span className="text-sm">Upload Images</span>
            </motion.div>
            <Input
              type="file"
              onChange={onUpload}
              accept="image/*"
              className="hidden"
              multiple
            />
          </Label>
        )}
      </motion.div>
    </div>
  )
}

export default ImageUpload
