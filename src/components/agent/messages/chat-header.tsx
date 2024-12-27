"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu } from "lucide-react"

import { getInitials } from "@/lib/utils"

import type { UserData } from "@/lib/types"

interface ChatHeaderProps {
  selectedUser: UserData | null
  isMobile: boolean
  toggleSidebar: () => void
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

const ChatHeader = ({
  selectedUser,
  isMobile,
  toggleSidebar,
}: ChatHeaderProps) => (
  <div className="p-4 border-b flex items-center gap-2">
    {isMobile && (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="md:hidden"
      >
        <Menu className="size-5" />
      </Button>
    )}
    <div className="flex items-center gap-3">
      <Avatar className="size-10">
        <AvatarFallback>
          {selectedUser ? getInitials(selectedUser.name) : "?"}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{selectedUser?.name}</h3>
          {selectedUser?.role && (
            <Badge
              variant={getRoleBadgeVariant(selectedUser.role)}
              className="capitalize"
            >
              {selectedUser.role}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
      </div>
    </div>
  </div>
)

export default ChatHeader
