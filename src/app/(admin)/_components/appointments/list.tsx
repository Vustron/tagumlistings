// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AppointmentItem {
  id: string
  name: string
  email: string
  avatarSrc: string
  avatarFallback: string
}

interface AppointmentsProps {
  appointments: AppointmentItem[]
}

const AppointmentRow = ({
  name,
  email,
  avatarSrc,
  avatarFallback,
}: AppointmentItem) => {
  return (
    <div className="flex items-center">
      <Avatar className="h-9 w-9">
        <AvatarImage src={avatarSrc} alt={`${name}'s avatar`} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  )
}

const AppointmentsList = ({ appointments }: AppointmentsProps) => {
  return (
    <div className="space-y-7 overflow-y-auto">
      {appointments.map((appointment) => (
        <AppointmentRow key={appointment.id} {...appointment} />
      ))}
    </div>
  )
}

export default AppointmentsList
