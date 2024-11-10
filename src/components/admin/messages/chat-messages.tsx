"use client"

// components
import EditMessageDialog from "@/components/admin/messages/edit-message-modal"
import ViewImageDialog from "@/components/admin/messages/view-image-modal"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"

// utils
import { motion, AnimatePresence } from "framer-motion"
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"
import { format } from "date-fns"

// hooks
import { useDeleteMessage } from "@/lib/hooks/messages/delete"
import { useUpdateMessage } from "@/lib/hooks/messages/update"
import { useConfirm } from "@/lib/hooks/utils/use-confirm"
import { useCallback, useState } from "react"

// types
import type { Timestamp } from "firebase/firestore"
import type { Message } from "@/lib/types"
import type { RefObject } from "react"

interface ChatMessagesProps {
  messages: Message[]
  currentUserId: string
  scrollAreaRef: RefObject<HTMLDivElement>
}

export default function ChatMessages({
  messages,
  currentUserId,
  scrollAreaRef,
}: ChatMessagesProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const updateMessageMutation = useUpdateMessage()
  const deleteMessageMutation = useDeleteMessage()
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
    {},
  )

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this message",
  )

  const isMessageFromCurrentUser = useCallback(
    (msg: Message) => msg.senderId === currentUserId,
    [currentUserId],
  )

  const formatTimestamp = useCallback(
    (timestamp: Timestamp | string | undefined) => {
      if (!timestamp) return "Invalid date"

      let date: Date
      if (
        typeof timestamp === "object" &&
        "seconds" in timestamp &&
        "nanoseconds" in timestamp
      ) {
        date = new Date(
          timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000,
        )
      } else if (typeof timestamp === "string") {
        date = new Date(timestamp)
      } else {
        return "Invalid date"
      }

      return Number.isNaN(date.getTime())
        ? "Invalid date"
        : format(date, "MM/dd/yyyy - h:mm a")
    },
    [],
  )

  const sortedMessages = [...messages].sort((a, b) => {
    const aTime =
      a.createdAt && typeof a.createdAt === "object"
        ? (a.createdAt as Timestamp).seconds
        : 0
    const bTime =
      b.createdAt && typeof b.createdAt === "object"
        ? (b.createdAt as Timestamp).seconds
        : 0
    return aTime - bTime
  })

  const handleSaveEdit = async (content: string) => {
    if (!editingMessageId) return

    const messageToUpdate = messages.find((msg) => msg.id === editingMessageId)
    if (!messageToUpdate) return

    const updateValues = {
      ...messageToUpdate,
      content,
      updatedAt: new Date().toISOString(),
      images: messageToUpdate.images ?? [],
    }

    await toast.promise(updateMessageMutation.mutateAsync(updateValues), {
      loading: <span className="animate-pulse">Updating message...</span>,
      success: "Message updated",
      error: (error: unknown) => clientErrorHandler(error),
    })

    setIsEditDialogOpen(false)
    setEditingMessageId(null)
  }

  const handleDelete = async (msg: Message) => {
    const ok = await confirm()

    if (ok) {
      await toast.promise(deleteMessageMutation.mutateAsync(msg.id!), {
        loading: <span className="animate-pulse">Deleting message...</span>,
        success: "Message deleted",
        error: (error: unknown) => clientErrorHandler(error),
      })
    }
  }

  const handleImageLoad = useCallback((messageId: string) => {
    setLoadingImages((prev) => ({ ...prev, [messageId]: false }))
  }, [])

  const renderMessageActions = (msg: Message) => {
    // Only render actions if the message is from the current user
    if (!isMessageFromCurrentUser(msg)) return null

    return (
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
        {msg.content && (
          <EditMessageDialog
            msg={msg}
            isEditDialogOpen={isEditDialogOpen && editingMessageId === msg.id}
            setIsEditDialogOpen={(open) => {
              setIsEditDialogOpen(open)
              setEditingMessageId(open ? msg.id! : null)
            }}
            handleSaveEdit={handleSaveEdit}
          />
        )}

        <Button
          variant="ghost"
          className="p-1"
          onClick={() => handleDelete(msg)}
        >
          <TrashIcon className="size-4 dark:text-white" />
        </Button>
      </div>
    )
  }

  const renderMessageContent = (msg: Message) => (
    <div className="flex flex-col gap-2 p-2">
      {msg.content && (
        <div
          className={`relative break-words whitespace-pre-wrap p-3 rounded-lg ${
            isMessageFromCurrentUser(msg)
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {msg.content}
          {/* {!isMessageFromCurrentUser(msg) && (
            <div className="text-xs text-muted-foreground mt-1">
              {msg.status}
            </div>
          )} */}
        </div>
      )}

      {msg.images?.length! > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {msg.images!.map((image, index) => (
            <ViewImageDialog
              key={`${msg.id}-image-${index}`}
              image={image}
              index={index}
              messageId={msg.id!}
              onLoad={() => handleImageLoad(msg.id!)}
              isLoading={loadingImages[msg.id!]}
            />
          ))}
        </div>
      )}

      {renderMessageActions(msg)}
    </div>
  )

  return (
    <>
      <ConfirmDialog />
      <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
        <AnimatePresence initial={false}>
          {sortedMessages.map((msg: Message) => (
            <motion.div
              key={msg.id}
              className={`group flex flex-col space-y-2 ${
                isMessageFromCurrentUser(msg) ? "items-end" : "items-start"
              }`}
              data-message-id={msg.id}
            >
              {msg.createdAt && (
                <time className="text-xs text-muted-foreground">
                  {formatTimestamp(msg.createdAt as unknown as Timestamp)}
                </time>
              )}
              <div className="relative flex items-start gap-2 max-w-[70%]">
                {renderMessageContent(msg)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </>
  )
}
