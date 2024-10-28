import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UserData } from "@/lib/types"

interface ChatHeaderProps {
  selectedUser: UserData | null
  isAdmin?: boolean
  isMobile: boolean
  toggleSidebar: () => void
}

const ChatHeader = ({
  selectedUser,
  isAdmin,
  isMobile,
  toggleSidebar,
}: ChatHeaderProps) => (
  <header className="p-4 border-b border-border flex justify-between items-center bg-card">
    <div className="flex items-center space-x-4">
      <div>
        <h2 className="text-lg font-semibold">{selectedUser?.name}</h2>
        <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
        {selectedUser?.contact_number && (
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
)

export default ChatHeader
