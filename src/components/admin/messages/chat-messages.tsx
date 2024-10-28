"use client"

// components
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

// utils
import { motion, AnimatePresence } from "framer-motion"
import { format, parseISO, isValid } from "date-fns"

// types
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
  const isMessageFromCurrentUser = (msg: Message) =>
    msg.senderId === currentUserId

  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.createdAt || "").getTime() -
      new Date(b.createdAt || "").getTime(),
  )

  return (
    <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
      <AnimatePresence initial={false}>
        {sortedMessages.map((msg: Message) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`flex flex-col space-y-2 ${
              isMessageFromCurrentUser(msg) ? "items-end" : "items-start"
            }`}
          >
            <div className="flex items-start gap-2 max-w-[70%]">
              <div className="flex flex-col gap-2">
                {msg.content && (
                  <div
                    className={`break-words whitespace-pre-wrap p-3 rounded-lg ${
                      isMessageFromCurrentUser(msg)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                )}
                {msg.images && msg.images.length > 0 && (
                  <div className="grid grid-cols-1 gap-2">
                    {msg.images.map((image, index) => (
                      <Dialog key={index}>
                        <DialogTrigger asChild>
                          <div className="relative size-48 rounded-lg overflow-hidden cursor-pointer">
                            <Image
                              src={image}
                              alt={`Attachment ${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <div className="relative w-full h-[80vh]">
                            <Image
                              src={image}
                              alt={`Attachment ${index + 1}`}
                              layout="fill"
                              objectFit="contain"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {msg.createdAt && isValid(parseISO(msg.createdAt)) && (
              <time className="text-xs text-muted-foreground">
                {format(parseISO(msg.createdAt), "PPpp")}
              </time>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </ScrollArea>
  )
}
