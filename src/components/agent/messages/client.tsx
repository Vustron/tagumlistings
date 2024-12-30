"use client"

// components
import ChatWindow from "@/components/agent/messages/chat-window"
import Sidebar from "@/components/agent/messages/sidebar"
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(
    null as unknown as HTMLDivElement,
  )

  // Data fetching
  const { data: accounts } = useGetAccounts()
  const { data: messages } = useGetMessages()
  const createMessageMutation = useCreateMessage()
  const session = useSession()

  // Set default user if not admin and no user is selected
  useEffect(() => {
    if (!isAdmin && accounts.accounts.length > 0 && !selectedUser) {
      const defaultAccount = accounts.accounts.find((account) =>
        session.role === "client"
          ? account.role === "agent"
          : account.role === "client",
      )
      if (defaultAccount) {
        setSelectedUser(defaultAccount)
      }
    }
  }, [isAdmin, accounts, selectedUser, session.role])

  const filteredAccounts = useMemo(() => {
    switch (session.role) {
      case "admin":
        return accounts.accounts.filter((account) => account.role !== "admin")
      case "agent":
        return accounts.accounts.filter((account) => account.role === "client")
      case "client":
        return accounts.accounts.filter((account) => account.role === "agent")
      default:
        return []
    }
  }, [accounts, session.role])

  // Filter messages for selected user
  const filteredMessages = useMemo(() => {
    return messages.messages
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
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsSidebarOpen(width >= 768)
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

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const agentId = searchParams.get("agentId")

    if (agentId && accounts.accounts.length > 0) {
      const agent = accounts.accounts.find((acc) => acc.id === agentId)
      if (agent) {
        setSelectedUser(agent)
      }
    }
  }, [accounts])

  return (
    <Card className="rounded-lg border-none h-[calc(100vh-4rem)] mt-5">
      <CardContent className="p-0 h-full relative">
        <div className="flex h-full relative">
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
