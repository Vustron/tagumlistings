"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

import { useSession } from "@/components/providers/session"
import { useRef, useMemo } from "react"

import { motion, AnimatePresence } from "framer-motion"
import { getInitials } from "@/lib/utils"

import type { UserData } from "@/lib/types"

interface SidebarProps {
  users: UserData[]
  isSidebarOpen: boolean
  isMobile: boolean
  toggleSidebar: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  setSelectedUser: (user: UserData | null) => void
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
  const session = useSession()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredUsersByRole = useMemo(() => {
    if (session.role === "client") {
      return users.filter((user) => user.role === "agent")
    }
    if (session.role === "agent") {
      return users.filter((user) => user.role === "client")
    }
    return users
  }, [users, session.role])

  const filteredUsers = useMemo(() => {
    return filteredUsersByRole.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.contact_number.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [filteredUsersByRole, searchQuery])

  const handleUserSelect = (user: UserData) => {
    setSelectedUser(user)
    if (isMobile) {
      toggleSidebar()
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    searchInputRef.current?.focus()
  }

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "agent":
        return "default"
      case "client":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isSidebarOpen ? 320 : 0,
        x: isSidebarOpen ? 0 : -320,
      }}
      transition={{ duration: 0.2 }}
      className={`p-3 overflow-y-hidden h-full bg-background border-r ${
        isMobile ? "fixed left-0 z-50 shadow-lg" : "relative"
      }`}
    >
      <header className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Messages</h2>
          {isMobile && isSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden"
            >
              <X className="size-5" />
            </Button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-1 top-1.5 size-6"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </header>

      {isSidebarOpen && (
        <ScrollArea className="flex-grow h-[calc(100vh-8rem)]">
          <AnimatePresence>
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ${
                  selectedUser?.id === user.id
                    ? "bg-accent/60 dark:text-white"
                    : "hover:bg-accent/30"
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <Avatar className="size-10 flex-shrink-0 truncate">
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="ml-3 overflow-hidden flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium truncate">{user.name}</p>
                    <Badge
                      variant={getRoleBadgeVariant(user.role)}
                      className="capitalize shrink-0"
                    >
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      )}
    </motion.aside>
  )
}

export default Sidebar
