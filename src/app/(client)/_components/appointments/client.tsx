// components
import Calendar from "@/app/(admin)/_components/appointments/calendar"
import { events } from "@/app/(client)/_components/data/appointments"

const AppointmentsClient = () => {
  return (
    <div className="mt-6 mb-2">
      <Calendar events={events} />
    </div>
  )
}

export default AppointmentsClient
