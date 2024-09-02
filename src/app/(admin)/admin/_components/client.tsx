// components
import Appointments from "@/app/(admin)/admin/_components/appointments"
import AppointmentsChart from "@/app/(admin)/admin/_components/appointments-chart"
import DashboardCard from "@/app/(admin)/admin/_components/dashboard-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// utils
import { appointmentsData, dashboardItems } from "@/app/(admin)/admin/constants"

const AdminDashboardClient = () => {
  return (
    <div className="p-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard items={dashboardItems} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <div className="col-span-4">
          <AppointmentsChart />
        </div>

        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle className="text-green-600">
              Recent Appointments
            </CardTitle>
            <CardDescription>
              There are 69 appointments for this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Appointments appointments={appointmentsData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboardClient
