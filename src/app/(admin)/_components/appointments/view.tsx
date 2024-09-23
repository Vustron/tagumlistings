"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Search, Calendar, Filter, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventItem from "@/app/(admin)/_components/appointments/event-item"

// types
import type React from "react"

interface Appointment {
  id?: string
  user: string
  date: Date
  description: string
  color: string
}

interface AppointmentsViewProps {
  events: Appointment[]
  onUpdate?: (id: string) => void
  onDelete?: (id: string) => void
}

const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  events,
  onUpdate,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showPastEvents, setShowPastEvents] = useState(false)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [view, setView] = useState<"list" | "grid">("list")

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const query = searchQuery.toLowerCase()
        return (
          event.user.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
        )
      })
      .filter((event) => {
        if (showPastEvents) return true
        return new Date(event.date) >= new Date()
      })
      .sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return sortOrder === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime()
      })
  }, [events, searchQuery, showPastEvents, sortOrder])

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => setShowPastEvents((prev) => !prev)}
              >
                {showPastEvents ? "Hide Past Events" : "Show Past Events"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={toggleSortOrder}>
                Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"}
                )
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tabs
            value={view}
            onValueChange={(value) => setView(value as "list" | "grid")}
          >
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="grid">Grid</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <AnimatePresence>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={
              view === "list"
                ? "space-y-2"
                : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            }
          >
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                className={`p-3 border rounded-lg ${view === "list" ? "flex items-center justify-between" : ""}`}
              >
                <div className="flex-grow">
                  <EventItem
                    event={event}
                    showDate={view === "list"}
                    compact={view === "grid"}
                  />
                  {view === "grid" && (
                    <div className="mt-2 text-sm text-gray-500">
                      <Calendar className="inline-block w-4 h-4 mr-1" />
                      {format(new Date(event.date), "MMM d, yyyy HH:mm")}
                    </div>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => onUpdate?.(event.id!)}>
                      Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onDelete?.(event.id!)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </ScrollArea>
      <div className="flex justify-between items-center mt-4">
        <Badge variant="outline">
          {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
        </Badge>
      </div>
    </motion.div>
  )
}

export default AppointmentsView
