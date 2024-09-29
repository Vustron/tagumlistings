"use client"

// components
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// utils
import { getInitials } from "@/lib/utils"

// types
import type { Appointment } from "@/app/(admin)/_components/appointments/new"
import { format } from "date-fns"

interface AppointmentItem {
  id: string
  user: string
  date: string
}

interface AppointmentsProps {
  appointments: Appointment[]
}

const AppointmentRow = ({ user, date }: AppointmentItem) => {
  return (
    <div className="flex items-center">
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-gray-200 text-black">
          {getInitials(user || "User")}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{user}</p>
        <p className="text-sm text-muted-foreground">
          {format(new Date(date), "MMM d, yyyy")}
        </p>
      </div>
    </div>
  )
}

const AppointmentsList = ({ appointments }: AppointmentsProps) => {
  return (
    <div className="space-y-7 overflow-y-auto">
      {appointments.map((appointment) => (
        <AppointmentRow
          key={appointment.id}
          id={appointment.id!}
          user={appointment.user}
          date={new Date(appointment.date).toISOString()}
        />
      ))}
    </div>
  )
}

export default AppointmentsList
