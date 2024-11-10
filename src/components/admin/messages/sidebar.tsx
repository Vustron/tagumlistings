// sidebar.tsx
"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Menu, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "@/components/providers/session"
import { useGetMessages } from "@/lib/hooks/messages/get-all"

import type { UserData } from "@/lib/types"
import { updateMessagesSeenStatus } from "@/lib/actions/messages/status"

interface SidebarProps {
  users: UserData[]
  isSidebarOpen: boolean
  isMobile: boolean
  toggleSidebar: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  setSelectedUser: (user: UserData) => void
  selectedUser: UserData | null
}

const Sidebar = ({
  users,
  isSidebarOpen,
  isMobile,
  toggleSidebar,
  searchQuery,
  setSearchQuery,
  setSelectedUser,
  selectedUser,
}: SidebarProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const session = useSession()
  const { data: messagesData } = useGetMessages()
  const messages = messagesData?.messages ?? []

  useEffect(() => {
    if (isSidebarOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSidebarOpen])

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n?.[0] || "")
      .join("")
      .toUpperCase()
  }

  const usersWithMessages = users.map((user) => {
    const userMessages = messages.filter(
      (msg) =>
        (msg.senderId === user.id && msg.receiverId === session.id) ||
        (msg.receiverId === user.id && msg.senderId === session.id),
    )

    const unseenCount = userMessages.filter(
      (msg) => !msg.seen && msg.senderId === user.id,
    ).length

    const latestMessage = userMessages.reduce((latest, current) => {
      if (!latest) return current
      const currentDate = current.createdAt
        ? new Date(current.createdAt)
        : new Date(0)
      const latestDate = latest?.createdAt
        ? new Date(latest.createdAt)
        : new Date(0)
      return currentDate > latestDate ? current : latest
    }, userMessages[0])

    return {
      ...user,
      unseenCount,
      latestMessage,
    }
  })

  const sortedUsers = usersWithMessages.sort((a, b) => {
    // First priority: unseen messages
    if (a.unseenCount === 0 && b.unseenCount > 0) return 1
    if (a.unseenCount > 0 && b.unseenCount === 0) return -1

    // Second priority: latest message timestamp
    const getLatestTimestamp = (user: typeof a) => {
      if (!user.latestMessage?.createdAt) return 0
      return typeof user.latestMessage.createdAt === "string"
        ? new Date(user.latestMessage.createdAt).getTime()
        : new Date(user.latestMessage.createdAt).getTime()
    }

    const timeA = getLatestTimestamp(a)
    const timeB = getLatestTimestamp(b)

    // Sort in descending order (most recent first)
    return timeB - timeA
  })

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.contact_number.includes(searchQuery),
  )

  const handleUserSelect = async (user: UserData) => {
    setSelectedUser(user)
    if (isMobile) toggleSidebar()

    if (session.role === "admin") {
      const unseenMessages = messages.filter(
        (msg) =>
          msg.senderId === user.id &&
          msg.receiverId === session.id &&
          !msg.seen,
      )

      if (unseenMessages.length > 0) {
        await updateMessagesSeenStatus(unseenMessages)
      }
    }
  }

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isSidebarOpen ? (isMobile ? "100%" : "300px") : "64px",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`border-r border-border flex flex-col ${
        isMobile && !isSidebarOpen ? "hidden" : ""
      } ${isMobile ? "fixed inset-0" : "relative"} z-10 bg-background h-full`}
    >
      <header className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <Button
            onClick={toggleSidebar}
            size="icon"
            variant="ghost"
            className="text-foreground"
          >
            {isSidebarOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
            <span className="sr-only">
              {isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            </span>
          </Button>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-grow ml-4"
            >
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </motion.div>
          )}
        </div>
      </header>
      <ScrollArea className="flex-grow">
        <AnimatePresence>
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ${
                selectedUser?.id === user.id
                  ? "bg-accent text-accent-foreground dark:text-white"
                  : "hover:bg-accent/50 hover:text-accent-foreground dark:hover:text-white"
              } ${isSidebarOpen ? "" : "justify-center"}`}
              onClick={() => handleUserSelect(user)}
            >
              <div className="relative">
                <Avatar className="size-10 flex-shrink-0 text-black dark:text-white">
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                {user.unseenCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 text-xs text-white flex items-center justify-center">
                    {user.unseenCount}
                  </span>
                )}
              </div>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-3 overflow-hidden flex-grow"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium truncate">{user.name}</div>
                      <div
                        className={`text-sm truncate ${
                          selectedUser?.id === user.id
                            ? "text-white"
                            : "text-black/70 dark:text-white"
                        }`}
                      >
                        {user.email}
                      </div>
                      <div
                        className={`text-xs truncate ${
                          selectedUser?.id === user.id
                            ? "text-white"
                            : "text-black/70 dark:text-white"
                        }`}
                      >
                        {user.contact_number}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </motion.aside>
  )
}

export default Sidebar
