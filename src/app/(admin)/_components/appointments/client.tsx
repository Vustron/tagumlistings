// components
import Calendar from "@/app/(admin)/_components/appointments/calendar"

const AppointmentsClient = () => {
  const events = [
    {
      id: "1",
      title: "Meeting 1",
      date: new Date(2024, 7, 1, 10, 0),
      description: "Team meeting",
    },
    {
      id: "2",
      title: "Lunch",
      date: new Date(2024, 7, 2, 12, 30),
      description: "Lunch with client",
    },
    {
      id: "3",
      title: "Conference",
      date: new Date(2024, 7, 5, 9, 0),
      description: "Annual conference",
    },
    // Add more events as needed
  ]

  return (
    <div className="mt-6 mb-2">
      <Calendar events={events} />
    </div>
  )
}

export default AppointmentsClient
