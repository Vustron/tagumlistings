"use client"

// components
import EventItem from "@/components/admin/appointments/event-item"
import { ScrollArea } from "@/components/ui/scroll-area"

// utils
import {
  format,
  isSameDay,
  endOfWeek,
  startOfWeek,
  eachDayOfInterval,
} from "date-fns"
import { motion } from "framer-motion"

// types
import type { Appointment } from "@/lib/types"

interface WeekViewProps {
  currentDate: Date
  events: Appointment[]
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, events }) => {
  const start = startOfWeek(currentDate)
  const end = endOfWeek(currentDate)
  const days = eachDayOfInterval({ start, end })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-7 gap-1"
    >
      {days.map((day, index) => (
        <motion.div
          key={day.toString()}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-2 border ${
            isSameDay(day, new Date())
              ? "bg-blue-100 dark:bg-blue-900"
              : "bg-white dark:bg-gray-800"
          }`}
        >
          <div className="font-bold">{format(day, "EEE d")}</div>
          <ScrollArea className="h-96">
            {events
              .filter((event) => isSameDay(event.date, day))
              .map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
          </ScrollArea>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default WeekView
