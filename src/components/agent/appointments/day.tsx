"use client"

// components
import EventItem from "@/components/agent/appointments/event-item"
import { ScrollArea } from "@/components/ui/scroll-area"

// utils
import { format, isSameDay } from "date-fns"
import { motion } from "framer-motion"

// types
import type { Appointment } from "@/lib/types"

interface DayViewProps {
  currentDate: Date
  events: Appointment[]
}

const DayView: React.FC<DayViewProps> = ({ currentDate, events }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-2 border bg-white dark:bg-gray-800"
    >
      <div className="text-xl font-bold mb-4">
        {format(currentDate, "EEEE, MMMM d, yyyy")}
      </div>
      <ScrollArea className="h-[calc(100vh-300px)]">
        {events
          .filter((event) => isSameDay(event.date, currentDate))
          .map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
      </ScrollArea>
    </motion.div>
  )
}

export default DayView
