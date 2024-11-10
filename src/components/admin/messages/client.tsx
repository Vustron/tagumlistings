"use client"

// components
import ChatWindow from "@/components/admin/messages/chat-window"
import Sidebar from "@/components/admin/messages/sidebar"
import { Card, CardContent } from "@/components/ui/card"

// hooks
import { useCreateMessage } from "@/lib/hooks/messages/create"
import { useGetMessages } from "@/lib/hooks/messages/get-all"

import { useEffect, useState, useRef, useMemo } from "react"
import { useSession } from "@/components/providers/session"
import { useGetAccounts } from "@/lib/hooks/auth/get-all"

// utils
import { clientErrorHandler, uploadMultipleImages } from "@/lib/utils"
import toast from "react-hot-toast"

// types
import type { UserData } from "@/lib/types"

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

  // Data fetching
  const { data: accountsData } = useGetAccounts()
  const { data: messagesData } = useGetMessages()
  const createMessageMutation = useCreateMessage()
  const session = useSession()
  const accounts = accountsData?.accounts ?? []
  const messages = messagesData?.messages ?? []

  // Set default user if not admin and no user is selected
  useEffect(() => {
    if (!isAdmin && accounts.length > 0 && !selectedUser) {
      const adminAccount = accounts.find((account) => account.role === "admin")
      if (adminAccount) {
        setSelectedUser(adminAccount)
      }
    }
  }, [isAdmin, accounts, selectedUser])

  const filteredAccounts = useMemo(() => {
    if (session.role === "admin") {
      return accounts.filter((account) => account.role !== "admin")
    }
    return accounts.filter((account) => account.role === "admin")
  }, [accounts, session.role])

  // Filter messages for selected user
  const filteredMessages = useMemo(() => {
    return messages
      .filter(
        (msg) =>
          (msg.senderId === selectedUser?.id &&
            msg.receiverId === session.id) ||
          (msg.receiverId === selectedUser?.id && msg.senderId === session.id),
      )
      .sort((a, b) => {
        // Handle different possible date formats
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateA - dateB
      })
  }, [messages, selectedUser, session.id])

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
    try {
      const imageUrls = await uploadMultipleImages(files, session.id)
      return imageUrls
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`)
      throw error
    }
  }

  // Send message handler
  const handleSendMessage = async (): Promise<void> => {
    if ((!message.trim() && selectedImages.length === 0) || !selectedUser)
      return

    // Upload images if any
    const imageUrls =
      selectedImages.length > 0 ? await handleImageUpload(selectedImages) : []

    await toast.promise(
      createMessageMutation.mutateAsync({
        content: message.trim(),
        images: imageUrls,
        senderId: session.id,
        receiverId: selectedUser.id,
      }),
      {
        loading: <span className="animate-pulse">Sending message...</span>,
        success: "Message sent",
        error: (error: unknown) => clientErrorHandler(error),
      },
    )

    setMessage("")
    setSelectedImages([])
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <Card
      className={`rounded-lg border-none h-[calc(100vh+200px)] ${
        session.role === "admin" ? "p-5" : "p-20"
      } mt-5`}
    >
      <CardContent className={"p-0 h-full w-auto container"}>
        <div className="flex h-full bg-background">
          {session.role === "admin" && (
            <Sidebar
              users={filteredAccounts}
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
            isLoading={createMessageMutation.isPending}
            currentUserId={session.id}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default MessagesClient
