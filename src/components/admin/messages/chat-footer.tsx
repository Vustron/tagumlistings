// components
import { ImageIcon, X, Loader2, SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// hooks
import { useRef } from "react"

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
  const inputRef = useRef<HTMLInputElement>(null)
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

  return (
    <footer className="p-4 border-t border-border bg-card">
      {selectedImages.length > 0 && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {selectedImages.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Selected ${index + 1}`}
                className="h-20 w-20 object-cover rounded"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={() => removeImage(index)}
                disabled={isLoading}
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
        />
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <ImageIcon className="size-5" />
          <span className="sr-only">Add images</span>
        </Button>
        <Input
          ref={inputRef}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="bg-green-500 text-primary-foreground hover:bg-green-400"
          disabled={
            (!message.trim() && selectedImages.length === 0) || isLoading
          }
        >
          {isLoading ? (
            <Loader2 className="animate-spin size-5" />
          ) : (
            <SendHorizontal className="size-5" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </footer>
  )
}

export default ChatFooter
