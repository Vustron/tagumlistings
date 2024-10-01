"use client"

// components
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  CalendarIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// utils
import { motion } from "framer-motion"

// types
import type { CalendarView } from "@/components/admin/appointments/calendar"

interface CalendarControlsProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
  changeDate: (days: number) => void
  view: string
  setView: (view: CalendarView) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  setIsNewEventDialogOpen: (open: boolean) => void
  setIsSetAppointmentDatesDialogOpen: (open: boolean) => void
}

const CalendarControls: React.FC<CalendarControlsProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  changeDate,
  view,
  setView,
  searchQuery,
  setSearchQuery,
  setIsNewEventDialogOpen,
  setIsSetAppointmentDatesDialogOpen,
}) => {
  return (
    <div className="flex flex-col space-y-4 sm:space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
      {/* Sidebar Toggle & Date Navigation */}
      <div className="flex items-center space-x-2">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden"
        >
          <Button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="outline"
            size="sm"
            className="dark:bg-gray-800 dark:text-white"
          >
            <Menu className="size-4" />
          </Button>
        </motion.div>

        {/* Date Navigation Controls */}
        <div className="flex space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => changeDate(-1)}
              variant="outline"
              size="sm"
              className="dark:bg-gray-800 dark:text-white"
            >
              <ChevronLeft className="mr-1 size-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
          </motion.div>
          <Select
            value={view}
            onValueChange={(value: string) => setView(value as CalendarView)}
          >
            <SelectTrigger className="w-[100px] sm:w-[180px] dark:bg-gray-800 dark:text-white">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800">
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="appointments">Appointments</SelectItem>
            </SelectContent>
          </Select>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => changeDate(1)}
              variant="outline"
              size="sm"
              className="dark:bg-gray-800 dark:text-white"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Search and Action Buttons */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
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
        <div className="flex space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-grow sm:flex-grow-0"
          >
            <Button
              onClick={() => setIsNewEventDialogOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto"
            >
              <Plus className="mr-2 size-4" /> Add
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-grow sm:flex-grow-0"
          >
            <Button
              onClick={() => setIsSetAppointmentDatesDialogOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto"
            >
              <CalendarIcon className="mr-2 size-4" /> Set
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CalendarControls
