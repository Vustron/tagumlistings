// components
import ChatMessages from "@/components/admin/messages/chat-messages"
import ChatHeader from "@/components/admin/messages/chat-header"
import ChatFooter from "@/components/admin/messages/chat-footer"
import { User } from "lucide-react"

// hooks
import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

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

  useEffect(() => {
    if (selectedUser && inputRef.current) {
      inputRef.current.focus()
    }
  }, [selectedUser])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex-grow flex flex-col h-full bg-background"
    >
      {selectedUser ? (
        <>
          <ChatHeader
            selectedUser={selectedUser}
            isAdmin={isAdmin}
            isMobile={isMobile}
            toggleSidebar={toggleSidebar}
          />
          <ChatMessages
            messages={messages}
            currentUserId={currentUserId}
            scrollAreaRef={scrollAreaRef}
          />
          <ChatFooter
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            isLoading={isLoading}
          />
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
