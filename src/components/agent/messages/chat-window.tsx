"use client"

// components
import ChatMessages from "@/components/agent/messages/chat-messages"
import ChatHeader from "@/components/agent/messages/chat-header"
import ChatFooter from "@/components/agent/messages/chat-footer"
import { Button } from "@/components/ui/button"
import { Menu, User } from "lucide-react"

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
      className="flex-grow flex flex-col bg-background"
    >
      {selectedUser ? (
        <>
          <ChatHeader
            selectedUser={selectedUser}
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
        <div className="flex flex-col h-full">
          {isMobile && (
            <div className="p-4 border-b">
              <Button
                variant="outline"
                onClick={toggleSidebar}
                className="w-full py-6 text-base font-medium hover:bg-accent/80 transition-colors"
              >
                <Menu className="mr-2 size-5" />
                Select a User to Message
              </Button>
            </div>
          )}
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-8">
            <div className="rounded-full bg-muted p-4">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-xl">
                No Conversation Selected
              </h3>
              <p className="text-muted-foreground">
                Choose a user from the sidebar to start messaging
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default ChatWindow
