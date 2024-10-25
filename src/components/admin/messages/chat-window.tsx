"use client"

// components
import { SendHorizontal, Menu, User, X, ImageIcon, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// hooks
import { useRef, useEffect, useMemo } from "react"

// utils
import { motion, AnimatePresence } from "framer-motion"
import { format, parseISO, isValid } from "date-fns"

// types
import type { Message, UserData } from "@/lib/types"
import type { RefObject } from "react"

interface ChatWindowProps {
  selectedUser: UserData | null
  message: string
  setMessage: (message: string) => void
  handleSendMessage: () => void
  messages: Message[]
  selectedImages: File[]
  setSelectedImages: (images: File[]) => void
  isAdmin?: boolean
  isMobile: boolean
  toggleSidebar: () => void
  scrollAreaRef: RefObject<HTMLDivElement>
  isLoading?: boolean
  currentUserId: string
}

const ChatWindow = ({
  selectedUser,
  message,
  setMessage,
  handleSendMessage,
  messages = [],
  selectedImages,
  setSelectedImages,
  isAdmin,
  isMobile,
  toggleSidebar,
  scrollAreaRef,
  isLoading = false,
  currentUserId,
}: ChatWindowProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectedUser && inputRef.current) {
      inputRef.current.focus()
    }
  }, [selectedUser])

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

  // Function to determine if a message is sent by the current user
  const isMessageFromCurrentUser = (msg: Message) =>
    msg.senderId === currentUserId

  // Memoize sorted messages to avoid unnecessary re-renders
  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) =>
        new Date(a.createdAt || "").getTime() -
        new Date(b.createdAt || "").getTime(),
    )
  }, [messages])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex-grow flex flex-col h-full bg-background"
    >
      {selectedUser ? (
        <>
          <header className="p-4 border-b border-border flex justify-between items-center bg-card">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.email}
                </p>
                {selectedUser.contact_number && (
                  <p className="text-xs text-muted-foreground">
                    {selectedUser.contact_number}
                  </p>
                )}
              </div>
            </div>
            {isAdmin && isMobile && (
              <Button
                onClick={toggleSidebar}
                size="icon"
                variant="ghost"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            )}
          </header>

          <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
            <AnimatePresence initial={false}>
              {sortedMessages.map((msg: Message) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`flex flex-col space-y-2 ${
                    isMessageFromCurrentUser(msg) ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-start gap-2 max-w-[70%]">
                    <div className="flex flex-col gap-2">
                      {msg.content && (
                        <div
                          className={`break-words whitespace-pre-wrap p-3 rounded-lg ${
                            isMessageFromCurrentUser(msg)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {msg.content}
                        </div>
                      )}
                      {msg.images && msg.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {msg.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Attachment ${index + 1}`}
                              className="rounded-lg w-full h-auto object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {msg.createdAt && isValid(parseISO(msg.createdAt)) && (
                    <time className="text-xs text-muted-foreground">
                      {format(parseISO(msg.createdAt), "PPpp")}
                    </time>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>

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
                  <>
                    <SendHorizontal className="size-5" />
                    <span className="sr-only">Send message</span>
                  </>
                )}
              </Button>
            </form>
          </footer>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
          <User className="h-16 w-16 text-muted-foreground/50" />
          <p className="text-lg">
            {isAdmin ? "Select a user to start messaging" : "Loading chat..."}
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default ChatWindow
