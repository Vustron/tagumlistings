"use client"

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog"
import { Calendar, AlignLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// utils
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

// hooks
import { useState } from "react"

// types
import type { Appointment } from "@/lib/types"
import type React from "react"

interface EventItemProps {
  event: Appointment
  showDate?: boolean
  compact?: boolean
}

const EventItem: React.FC<EventItemProps> = ({ event, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const users = event.user.split(", ")

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "rounded-lg cursor-pointer",
            "transition-all duration-200 ease-in-out",
            "text-white flex flex-col items-center justify-center",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-grow min-w-0">
              <div className="flex flex-wrap gap-1">
                {users.slice(0, 3).map((user, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={cn(
                      "bg-white/20 hover:bg-white/30 border-white/50",
                      "text-xs px-2 py-0.5",
                      "transition-all duration-200",
                    )}
                  >
                    <span className="truncate max-w-[100px]">{user}</span>
                  </Badge>
                ))}
                {users.length > 3 && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "bg-black/20 hover:bg-black/30 border-white/50",
                      "text-xs px-2 py-0.5",
                    )}
                  >
                    +{users.length - 3}
                  </Badge>
                )}
              </div>
              {!compact && (
                <div className="flex items-center gap-2 text-sm sm:text-base truncate ml-2">
                  <Calendar className="size-4 shrink-0" />
                  <span className="truncate">
                    {format(event.date, "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </DialogTrigger>

      <AnimatePresence>
        {isOpen && (
          <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="rounded-lg overflow-hidden"
            >
              <DialogHeader className={cn("p-6", "bg-background")}>
                <DialogTitle className="text-xl md:text-2xl font-bold dark:text-white">
                  {event.user}
                </DialogTitle>
                <DialogDescription className="dark:text-blue-50 mt-2 flex items-center gap-2">
                  <Calendar className="size-4" />
                  {format(event.date, "MMMM d, yyyy")}
                </DialogDescription>
              </DialogHeader>

              <div className="p-6 space-y-6 bg-white dark:bg-gray-900">
                <div className="flex items-start gap-4">
                  <AlignLeft className="size-5 text-gray-500 mt-1" />
                  <div className="space-y-2 flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      Description
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}

export default EventItem
