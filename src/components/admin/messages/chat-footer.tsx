// components
import { ImageIcon, X, Loader2, SendHorizontal } from "lucide-react"
import { Textarea } from "@/components/ui/text-area"
import { Button } from "@/components/ui/button"

// hooks
import { useCallback, useRef } from "react"
import { cn } from "@/lib/utils"

interface ChatFooterProps {
  message: string
  setMessage: (message: string) => void
  handleSendMessage: () => void
  selectedImages: File[]
  setSelectedImages: (images: File[]) => void
  isLoading?: boolean
}

const ChatFooter = ({
  message,
  setMessage,
  handleSendMessage,
  selectedImages,
  setSelectedImages,
  isLoading = false,
}: ChatFooterProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages([...selectedImages, ...files])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index))
  }
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage],
  )

  return (
    <footer className="p-4 border-t border-border bg-card">
      {selectedImages.length > 0 && (
        <div
          className="mb-4 flex gap-2 overflow-x-auto pb-2"
          role="list"
          aria-label="Selected images"
        >
          {selectedImages.map((file, index) => (
            <div key={index} className="relative" role="listitem">
              <img
                src={URL.createObjectURL(file)}
                alt={`Selected file ${index + 1}`}
                className="h-20 w-20 object-cover rounded"
                loading="lazy"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={() => removeImage(index)}
                disabled={isLoading}
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSendMessage()
        }}
        className="flex space-x-2"
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
          disabled={isLoading}
          aria-label="Upload images"
        />

        <Textarea
          ref={inputRef}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex-grow min-h-[80px] resize-none",
            isLoading && "opacity-50 cursor-not-allowed",
          )}
          disabled={isLoading}
          aria-label="Message input"
        />

        <div className="flex flex-col space-y-2">
          <Button
            type="submit"
            size="icon"
            className={cn(
              "bg-green-500 text-primary-foreground",
              !isLoading && "hover:bg-green-400",
            )}
            disabled={
              (!message.trim() && selectedImages.length === 0) || isLoading
            }
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="animate-spin size-4" />
            ) : (
              <SendHorizontal className="size-4" />
            )}
          </Button>

          <Button
            type="button"
            size="icon"
            variant="outline"
            disabled={isLoading}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="size-5" />
          </Button>
        </div>
      </form>
    </footer>
  )
}

export default ChatFooter
