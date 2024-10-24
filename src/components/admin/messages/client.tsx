"use client"

// components
import ChatWindow from "@/components/admin/messages/chat-window"
import Sidebar from "@/components/admin/messages/sidebar"
import { Card, CardContent } from "@/components/ui/card"

// hooks
import { useGetMessages } from "@/lib/hooks/messages/get-all"
import { useSession } from "@/components/providers/session"
import { useGetAccounts } from "@/lib/hooks/auth/get-all"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next-nprogress-bar"

// utils
import { addDoc, collection } from "firebase/firestore"
import { firestore } from "@/lib/config/firebase"

// types
import type { QueryFilters } from "@tanstack/react-query"
import type { Message, UserData } from "@/lib/types"

interface MessagesClientProps {
  isAdmin?: boolean
}

const MessagesClient = ({ isAdmin }: MessagesClientProps) => {
  // State management
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const router = useRouter()

  // Data fetching
  const { data: accountsData } = useGetAccounts()
  const { data: messagesData } = useGetMessages()
  const session = useSession()
  const accounts = accountsData?.accounts ?? []
  const messages = messagesData.messages ?? []

  // Filter messages for selected user
  const filteredMessages = messages.filter(
    (msg) =>
      msg.senderId === selectedUser?.id || msg.receiverId === selectedUser?.id,
  )

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsSidebarOpen(window.innerWidth >= 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [filteredMessages])

  // Handle image upload
  const handleImageUpload = async (files: File[]): Promise<string[]> => {
    // Implement your image upload logic here
    // This is a placeholder that returns placeholder image URLs
    return files.map(
      (_, index) => `/api/placeholder/400/300?text=Image${index + 1}`,
    )
  }

  // Send message handler
  const handleSendMessage = async (): Promise<void> => {
    if ((!message.trim() && selectedImages.length === 0) || !selectedUser)
      return

    try {
      const messagesRef = collection(firestore, "messages")

      // Upload images if any
      const imageUrls =
        selectedImages.length > 0 ? await handleImageUpload(selectedImages) : []

      const newMessage: Message = {
        content: message.trim(),
        images: imageUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        senderId: session.id,
        receiverId: selectedUser.id,
      }

      await addDoc(messagesRef, newMessage)

      const queryFilter: QueryFilters = {
        queryKey: ["messages"],
      }

      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<Message[]>(["messages"], (oldMessages = []) => {
        if (!oldMessages) return [newMessage]

        return [...oldMessages, newMessage]
      })

      setMessage("")
      setSelectedImages([])
      router.refresh()
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <Card className="rounded-lg border-none mt-6 h-[calc(100vh-100px)]">
      <CardContent
        className={`p-0 h-full ${isAdmin ? "w-auto container" : "w-full"}`}
      >
        <div className="flex h-full bg-background">
          {isAdmin && (
            <Sidebar
              users={accounts}
              isSidebarOpen={isSidebarOpen}
              isMobile={isMobile}
              toggleSidebar={toggleSidebar}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setSelectedUser={setSelectedUser}
              selectedUser={selectedUser}
            />
          )}
          <ChatWindow
            selectedUser={selectedUser}
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            messages={filteredMessages}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            isAdmin={isAdmin}
            isMobile={isMobile}
            toggleSidebar={toggleSidebar}
            scrollAreaRef={scrollAreaRef}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default MessagesClient
