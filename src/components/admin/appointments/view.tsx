"use client"

// components
import { columns } from "@/components/admin/appointments/columns"
import DataTable from "@/components/ui/data-table"

// utils
import { motion } from "framer-motion"

// types
import type { Appointment, AppointmentDate } from "@/lib/types"
import type React from "react"

interface AppointmentsViewProps {
  events: Appointment[]
  appointmentDates?: AppointmentDate[]
}

const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  events,

  appointmentDates,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <DataTable
        placeholder="Search.."
        columns={columns}
        data={events}
        appointment={events}
        appointmentDates={appointmentDates}
        isOnClientAppointments
      />
    </motion.div>
  )
}

export default AppointmentsView
