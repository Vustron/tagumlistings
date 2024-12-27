"use client"

// components
import EventItem from "@/components/agent/appointments/event-item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

// utils
import {
  format,
  isSameDay,
  endOfWeek,
  endOfMonth,
  startOfWeek,
  isSameMonth,
  startOfMonth,
  eachDayOfInterval,
} from "date-fns"
import { motion } from "framer-motion"

// types
import type { Appointment } from "@/lib/types"

interface MonthViewProps {
  currentDate: Date
  events: Appointment[]
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, events }) => {
  const start = startOfWeek(startOfMonth(currentDate))
  const end = endOfWeek(endOfMonth(currentDate))
  const days = eachDayOfInterval({ start, end })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-7 gap-1 text-xs md:text-sm"
    >
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="text-center font-semibold p-1 md:p-2 text-gray-500 dark:text-gray-400"
        >
          {day}
        </div>
      ))}
      {days.map((day, index) => (
        <motion.div
          key={day.toString()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.01 }}
        >
          <Card
            className={`p-1 md:p-2 ${
              !isSameMonth(day, currentDate)
                ? "bg-gray-100 dark:bg-gray-800 opacity-50"
                : "bg-white dark:bg-gray-700"
            } ${
              isSameDay(day, new Date())
                ? "border-2 border-blue-500 dark:border-blue-300"
                : "border-0"
            }`}
          >
            <div className="text-xs md:text-sm font-medium">
              {format(day, "d")}
            </div>
            <ScrollArea className="h-20 md:h-32">
              {events
                .filter((event) => isSameDay(event.date, day))
                .map((event) => (
                  <EventItem key={event.id} event={event} compact />
                ))}
            </ScrollArea>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default MonthView
