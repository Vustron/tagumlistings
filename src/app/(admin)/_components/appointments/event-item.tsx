"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Calendar, AlignLeft, Clock, MapPin } from "lucide-react"

// utils
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

// hooks
import { useState } from "react"

// types
import type React from "react"

interface Appointment {
  id?: string
  user: string
  date: Date
  description: string
  color: string
  location?: string
  duration?: number
}

interface EventItemProps {
  event: Appointment
  showDate?: boolean
  compact?: boolean
}

const EventItem: React.FC<EventItemProps> = ({
  event,
  showDate = false,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 rounded-xl cursor-pointer text-left text-white overflow-hidden transition-all duration-300 ease-in-out ${
            compact ? "h-12 flex items-center justify-between" : "h-auto"
          }`}
          style={{ backgroundColor: event.color || "#3EF63BFF" }}
        >
          <div className="flex items-center">
            <div className="font-bold truncate text-sm mr-4">{event.user}</div>
            {showDate && !compact && (
              <div className="text-xs truncate flex items-center">
                <Clock className="size-3 mr-1" />
                {format(event.date, "HH:mm")}
              </div>
            )}
          </div>
          {!compact && (
            <div className="text-xs truncate flex items-center">
              <Calendar className="size-3 mr-1" />
              {format(event.date, "MMM d")}
            </div>
          )}
        </motion.div>
      </DialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <DialogContent
            forceMount
            className="w-[90vw] max-w-lg md:max-w-2xl lg:max-w-4xl rounded-2xl overflow-hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={dialogVariants}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="bg-gradient-to-r from-green-500 to-blue-600 p-4 md:p-6 rounded-t-2xl text-white">
                <DialogTitle className="text-xl md:text-2xl font-bold">
                  {event.user}
                </DialogTitle>
                <DialogDescription className="text-blue-100 mt-2 flex items-center">
                  <Calendar className="size-4 mr-2" />
                  {format(event.date, "MMMM d, yyyy")}
                </DialogDescription>
              </DialogHeader>
              <div className="p-4 md:p-6 space-y-4">
                <div className="flex items-start">
                  <Clock className="size-5 mr-3 text-gray-500 mt-1" />
                  <div>
                    <p className="text-gray-700 font-medium">Time</p>
                    <p className="text-gray-600">
                      {format(event.date, "HH:mm")}
                      {event.duration && ` (${event.duration} minutes)`}
                    </p>
                  </div>
                </div>
                {event.location && (
                  <div className="flex items-start">
                    <MapPin className="size-5 mr-3 text-gray-500 mt-1" />
                    <div>
                      <p className="text-gray-700 font-medium">Location</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start">
                  <AlignLeft className="size-5 mr-3 text-gray-500 mt-1" />
                  <div>
                    <p className="text-gray-700 font-medium">Description</p>
                    <p className="text-gray-600 leading-relaxed">
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
