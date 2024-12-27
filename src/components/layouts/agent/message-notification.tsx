"use client"

import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

import { updateMessagesSeenStatus } from "@/lib/actions/messages/status"

import { useMessageNotifications } from "@/lib/hooks/messages/notification"
import { useSession } from "@/components/providers/session"
import { useRouter } from "next-nprogress-bar"
import { useEffect } from "react"

export default function MessageNotification() {
  const router = useRouter()
  const session = useSession()
  const { unseenCount, unseenMessages, startListening } =
    useMessageNotifications(session.id)

  useEffect(() => {
    startListening()
  }, [startListening])

  const handleClick = async () => {
    if (unseenMessages.length > 0) {
      await updateMessagesSeenStatus(unseenMessages)
    }
    if (session?.role === "admin") {
      router.push("/admin/messages")
      return
    }
    if (session?.role === "agent") {
      router.push("/agent/messages")
      return
    }
    router.push("/contact")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="relative"
    >
      <Bell className="h-5 w-5" />
      {unseenCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 text-xs text-white flex items-center justify-center">
          {unseenCount}
        </span>
      )}
    </Button>
  )
}
