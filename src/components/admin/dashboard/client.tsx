"use client"

// components
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { BellPlus, CircleDollarSign, MapPinHouse, Clock } from "lucide-react"
import ReportsChart from "@/components/admin/reports/reports-chart"
import FallbackBoundary from "@/components/shared/fallback-boundary"
import AppointmentsList from "@/components/admin/appointments/list"
import DashboardCard from "@/components/admin/dashboard/card"

// hooks
import { useGetAppointments } from "@/lib/hooks/appointment/get-all"
import { useGetProperties } from "@/lib/hooks/property/get-all"
import { useGetPayments } from "@/lib/hooks/payment/get-all"

// utils
import {
  filterAppointmentsForLastHour,
  filterAppointmentsForCurrentMonth,
} from "@/lib/utils"

const AdminDashboardClient = () => {
  const { data: appointmentsData } = useGetAppointments()
  const { data: propertiesData } = useGetProperties()
  const { data: paymentsData } = useGetPayments()

  const appointments = appointmentsData?.appointments ?? []
  const currentMonthAppointments =
    filterAppointmentsForCurrentMonth(appointments)
  const lastHourAppointments = filterAppointmentsForLastHour(appointments)
  const appointmentsCount = currentMonthAppointments.length
  const lastHourAppointmentsCount = lastHourAppointments.length

  const properties = propertiesData?.properties ?? []
  const propertiesCount = properties.length

  const payments = paymentsData?.payments ?? []
  const paymentsCount = payments.length
  const pendingPayments = appointmentsCount - paymentsCount

  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)

  const propertiesLastMonth = properties.filter(
    (property) =>
      property.created_at && new Date(property.created_at) >= lastMonth,
  ).length

  const propertiesChange = propertiesCount - propertiesLastMonth
  const propertiesPercentageChange = (
    (propertiesChange / (propertiesLastMonth || 1)) *
    100
  ).toFixed(2)
  const propertiesChangeSign = propertiesChange >= 0 ? "+" : ""

  const paymentsLastMonth = payments.filter(
    (payment) => payment.paid_date && new Date(payment.paid_date) >= lastMonth,
  ).length

  const paymentsChange = paymentsCount - paymentsLastMonth
  const paymentsPercentageChange = (
    (paymentsChange / (paymentsLastMonth || 1)) *
    100
  ).toFixed(2)
  const paymentsChangeSign = paymentsChange >= 0 ? "+" : ""

  const pendingPaymentsLastMonth =
    appointments.filter((a) => new Date(a.date) >= lastMonth).length -
    paymentsLastMonth

  const pendingChange = pendingPayments - pendingPaymentsLastMonth
  const pendingPercentageChange = (
    (pendingChange / (pendingPaymentsLastMonth || 1)) *
    100
  ).toFixed(2)
  const pendingChangeSign = pendingChange >= 0 ? "+" : ""

  const percentageChange = (
    (lastHourAppointmentsCount / (appointmentsCount || 1)) *
    100
  ).toFixed(2)

  const dashboardItems = [
    {
      id: "1",
      title: "Total Properties",
      amount: `${propertiesCount}`,
      percentageChange: `${propertiesChangeSign}${propertiesPercentageChange}% from last month`,
      icon: <MapPinHouse className="size-4 text-muted-foreground" />,
    },
    {
      id: "2",
      title: "Total Payments",
      amount: `${paymentsCount}`,
      percentageChange: `${paymentsChangeSign}${paymentsPercentageChange}% from last month`,
      icon: <CircleDollarSign className="size-4 text-muted-foreground" />,
    },
    {
      id: "3",
      title: "Pending Payments",
      amount: `${pendingPayments}`,
      percentageChange: `${pendingChangeSign}${pendingPercentageChange}% from last month`,
      icon: <Clock className="size-4 text-muted-foreground" />,
    },
    {
      id: "4",
      title: "Appointments",
      amount: `${appointmentsCount}`,
      percentageChange: `+${percentageChange}% since last hour`,
      icon: <BellPlus className="size-4 text-muted-foreground" />,
    },
  ]

  return (
    <FallbackBoundary>
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard items={dashboardItems} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
          <div className="col-span-4">
            <ReportsChart payments={payments} appointments={appointments} />
          </div>

          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle className="text-green-600">
                Recent Appointments
              </CardTitle>
              <CardDescription>
                There are {appointmentsCount} appointments for this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentsList appointments={currentMonthAppointments} />
            </CardContent>
          </Card>
        </div>
      </div>
    </FallbackBoundary>
  )
}

export default AdminDashboardClient
