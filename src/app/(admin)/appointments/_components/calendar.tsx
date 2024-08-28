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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Menu, Plus, Search } from "lucide-react"

// utils
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import React, { useState, useEffect, useMemo } from "react"

type CalendarView = "month" | "week" | "day" | "agenda"

type Event = {
  id: string
  title: string
  date: Date
  description?: string
  color?: string
}

interface CalendarProps {
  events: Event[]
}

// TODO: rename events/agenda into appointments
const Calendar = ({ events: initialEvents }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>("month")
  const [searchQuery, setSearchQuery] = useState("")
  const [events, setEvents] = useState(initialEvents)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<Event>>({})
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false)

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
    const start = startOfWeek(startOfMonth(currentDate))
    const end = endOfWeek(endOfMonth(currentDate))
    const days = eachDayOfInterval({ start, end })

    return (
      <div className="grid grid-cols-7 gap-1 text-xs md:text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold p-1 md:p-2 text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
        {days.map((day) => (
          <Card
            key={day.toString()}
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
          <div
            key={day.toString()}
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
          </div>
        ))}
      </div>
    )
  }

  const renderDayView = () => {
    return (
      <div className="p-2 border bg-white dark:bg-gray-800">
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
      </div>
    )
  }

  const renderAgendaView = () => {
    return (
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-2">
          {events.map((event) => (
            <EventItem key={event.id} event={event} showDate />
          ))}
        </div>
      </ScrollArea>
    )
  }

  const EventItem = ({
    event,
    showDate = false,
    compact = false,
  }: { event: Event; showDate?: boolean; compact?: boolean }) => (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`p-1 rounded-xl cursor-pointer text-center text-white overflow-hidden ${compact ? "h-6" : ""}`}
          style={{ backgroundColor: event.color || "#3b82f6" }}
        >
          <div className="font-bold truncate text-xs">{event.title}</div>
          {showDate && !compact && (
            <div className="text-xs truncate">
              {format(event.date, "MMM d, HH:mm")}
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-lg">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <p>
            <strong>Date:</strong> {format(event.date, "MMMM d, yyyy HH:mm")}
          </p>
          <p>
            <strong>Description:</strong> {event.description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )

  const addNewEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([
        ...events,
        { ...newEvent, id: Date.now().toString() } as Event,
      ])
      setNewEvent({})
      setIsNewEventDialogOpen(false)
    }
  }

  const upcomingEvents = useMemo(() => {
    return events
      .filter((event) => event.date >= new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5)
  }, [events])

  return (
    <Card className="container mx-auto p-2 md:p-6 max-w-7xl bg-white dark:bg-gray-900 shadow-lg">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <Button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="outline"
            size="sm"
            className="md:hidden dark:bg-gray-800 dark:text-white"
          >
            <Menu className="size-4" />
          </Button>
          <div className="flex space-x-2">
            <Button
              onClick={() => changeDate(-1)}
              variant="outline"
              size="sm"
              className="dark:bg-gray-800 dark:text-white"
            >
              <ChevronLeft className="mr-1 size-4" />
              <span className="hidden md:inline">Previous</span>
            </Button>
            <Select
              value={view}
              onValueChange={(value: CalendarView) => setView(value)}
            >
              <SelectTrigger className="w-[100px] md:w-[180px] dark:bg-gray-800 dark:text-white">
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
              <span className="hidden md:inline">Next</span>
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="relative flex-grow">
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
          <Button
            onClick={() => setIsNewEventDialogOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>
      <div className="text-center text-2xl md:text-3xl mb-6 font-bold dark:text-white">
        {format(currentDate, "MMMM yyyy")}
      </div>
      <div className="flex flex-col md:flex-row">
        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } md:block w-full md:w-64 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg md:mr-4 mb-4 md:mb-0`}
        >
          <h2 className="text-lg font-bold mb-4">Upcoming Events</h2>
          <ScrollArea className="h-64 md:h-[calc(100vh-400px)]">
            {upcomingEvents.map((event) => (
              <EventItem key={event.id} event={event} showDate />
            ))}
          </ScrollArea>
        </div>
        <div className="flex-grow">
          {view === "month" && renderMonthView()}
          {view === "week" && renderWeekView()}
          {view === "day" && renderDayView()}
          {view === "agenda" && renderAgendaView()}
        </div>
      </div>

      <Dialog
        open={isNewEventDialogOpen}
        onOpenChange={setIsNewEventDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Event Title"
              value={newEvent.title || ""}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
            <Input
              type="datetime-local"
              value={
                newEvent.date ? format(newEvent.date, "yyyy-MM-dd'T'HH:mm") : ""
              }
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: new Date(e.target.value) })
              }
            />
            <Input
              placeholder="Description"
              value={newEvent.description || ""}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />
            <Input
              type="color"
              value={newEvent.color || "#3b82f6"}
              onChange={(e) =>
                setNewEvent({ ...newEvent, color: e.target.value })
              }
              className="rounded-2xl"
            />
            <Button
              onClick={addNewEvent}
              className="bg-green-500 hover:bg-green-400 text-white "
            >
              Add Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default Calendar
