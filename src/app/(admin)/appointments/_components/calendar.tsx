"use client"

// components
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

// utils
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import React, { useState, useEffect } from "react"

type CalendarView = "month" | "week" | "day" | "agenda"

type Event = {
  id: string
  title: string
  date: Date
  description?: string
}

interface CalendarProps {
  events: Event[]
}

const Calendar = ({ events: initialEvents }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>("month")
  const [searchQuery, setSearchQuery] = useState("")
  const [events, setEvents] = useState(initialEvents)

  useEffect(() => {
    if (searchQuery) {
      const encodedQuery = encodeURIComponent(searchQuery.toLowerCase())
      const regex = new RegExp(encodedQuery, "i")
      const filteredEvents = initialEvents.filter(
        (event) =>
          regex.test(encodeURIComponent(event.title.toLowerCase())) ||
          regex.test(
            encodeURIComponent(event.description?.toLowerCase() || ""),
          ),
      )
      setEvents(filteredEvents)
    } else {
      setEvents(initialEvents)
    }
  }, [searchQuery, initialEvents])

  const changeDate = (amount: number) => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, amount))
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, amount))
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, amount))
    }
  }

  const renderMonthView = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start, end })

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold p-2 text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <Card
            key={day.toString()}
            className={`p-2 ${index === 0 ? `col-start-${day.getDay() + 1}` : ""} bg-gray-100 dark:bg-gray-800 border-0`}
          >
            <div className="text-sm font-medium">{format(day, "d")}</div>
            {events
              .filter(
                (event) =>
                  format(event.date, "yyyy-MM-dd") ===
                  format(day, "yyyy-MM-dd"),
              )
              .map((event) => (
                <Dialog key={event.id}>
                  <DialogTrigger asChild>
                    <div className="text-xs bg-green-200 dark:bg-green-700 p-1 mt-1 rounded text-green-800 dark:text-green-100 cursor-pointer">
                      {event.title}
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{event.title}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">
                      <p>
                        <strong>Date:</strong>{" "}
                        {format(event.date, "MMMM d, yyyy HH:mm")}
                      </p>
                      <p>
                        <strong>Description:</strong> {event.description}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
          </Card>
        ))}
      </div>
    )
  }

  const renderWeekView = () => {
    const start = startOfWeek(currentDate)
    const end = endOfWeek(currentDate)
    const days = eachDayOfInterval({ start, end })

    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <div key={day.toString()} className="p-2 border">
            <div>{format(day, "EEE d")}</div>
            {events
              .filter(
                (event) =>
                  format(event.date, "yyyy-MM-dd") ===
                  format(day, "yyyy-MM-dd"),
              )
              .map((event) => (
                <div
                  key={event.id}
                  className="text-xs bg-blue-100 p-1 mt-1 rounded"
                >
                  {format(event.date, "HH:mm")} - {event.title}
                </div>
              ))}
          </div>
        ))}
      </div>
    )
  }

  const renderDayView = () => {
    return (
      <div className="p-2 border">
        <div>{format(currentDate, "EEEE, MMMM d, yyyy")}</div>
        {events
          .filter(
            (event) =>
              format(event.date, "yyyy-MM-dd") ===
              format(currentDate, "yyyy-MM-dd"),
          )
          .map((event) => (
            <div key={event.id} className="bg-blue-100 p-2 mt-2 rounded">
              <div>
                {format(event.date, "HH:mm")} - {event.title}
              </div>
              <div className="text-sm">{event.description}</div>
            </div>
          ))}
      </div>
    )
  }

  const renderAgendaView = () => {
    return (
      <div className="space-y-2">
        {events.map((event) => (
          <Dialog key={event.id}>
            <DialogTrigger asChild>
              <div className="bg-green-200 dark:bg-green-700 p-2 rounded cursor-pointer">
                <div className="font-bold text-green-800 dark:text-green-100">
                  {event.title}
                </div>
                <div className="text-sm text-green-700 dark:text-green-200">
                  {format(event.date, "EEEE, MMMM d, yyyy HH:mm")}
                </div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{event.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-2">
                <p>
                  <strong>Date:</strong>{" "}
                  {format(event.date, "MMMM d, yyyy HH:mm")}
                </p>
                <p>
                  <strong>Description:</strong> {event.description}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    )
  }

  return (
    <Card className="container mx-auto p-6 max-w-4xl bg-white dark:bg-gray-900 shadow-lg">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <Button
            onClick={() => changeDate(-1)}
            variant="outline"
            size="sm"
            className="dark:bg-gray-800 dark:text-white"
          >
            <ChevronLeft className="mr-1 size-4" />
            Previous
          </Button>
          <Select
            value={view}
            onValueChange={(value: CalendarView) => setView(value)}
          >
            <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:text-white">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800">
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="agenda">Agenda</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => changeDate(1)}
            variant="outline"
            size="sm"
            className="dark:bg-gray-800 dark:text-white"
          >
            Next
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 dark:bg-gray-800 dark:text-white w-full"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>
      <div className="text-center text-3xl mb-6 font-bold dark:text-white">
        {format(currentDate, "MMMM yyyy")}
      </div>
      {view === "month" && renderMonthView()}
      {view === "week" && renderWeekView()}
      {view === "day" && renderDayView()}
      {view === "agenda" && renderAgendaView()}
    </Card>
  )
}

export default Calendar
