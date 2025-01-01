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
import { useGetPayments } from "@/lib/hooks/payments/get-all"

// utils
import {
  filterAppointmentsForLastHour,
  filterAppointmentsForCurrentMonth,
} from "@/lib/utils"

const AdminDashboardClient = () => {
  const { data: appointments } = useGetAppointments()
  const { data: properties } = useGetProperties()
  const { data: payments } = useGetPayments()

  const totalAppointments = appointments.appointments.length
  const currentMonthAppointments = filterAppointmentsForCurrentMonth(
    appointments.appointments,
  )
  const lastHourAppointments = filterAppointmentsForLastHour(
    appointments.appointments,
  )

  const currentAppointmentsCount = currentMonthAppointments.length
  const lastHourAppointmentsCount = lastHourAppointments.length

  const propertiesCount = properties.properties.length
  const paymentsCount = payments.payments.length
  const pendingPayments = payments.payments.filter(
    (payment) => payment.status === "pending",
  ).length

  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)

  const propertiesLastMonth = properties.properties.filter(
    (property) =>
      property.created_at && new Date(property.created_at) >= lastMonth,
  ).length

  const propertiesChange = propertiesCount - propertiesLastMonth
  const propertiesPercentageChange = (
    (propertiesChange / (propertiesLastMonth || 1)) *
    100
  ).toFixed(2)
  const propertiesChangeSign = propertiesChange >= 0 ? "+" : ""

  const paymentsLastMonth = payments.payments.filter(
    (payment) => payment.paid_date && new Date(payment.paid_date) >= lastMonth,
  ).length

  const paymentsChange = paymentsCount - paymentsLastMonth
  const paymentsPercentageChange = (
    (paymentsChange / (paymentsLastMonth || 1)) *
    100
  ).toFixed(2)
  const paymentsChangeSign = paymentsChange >= 0 ? "+" : ""

  const pendingPaymentsLastMonth =
    appointments.appointments.filter((a) => new Date(a.date) >= lastMonth)
      .length - paymentsLastMonth

  const pendingChange = pendingPayments - pendingPaymentsLastMonth
  const pendingPercentageChange = (
    (pendingChange / (pendingPaymentsLastMonth || 1)) *
    100
  ).toFixed(2)
  const pendingChangeSign = pendingChange >= 0 ? "+" : ""

  const percentageChange = (
    (lastHourAppointmentsCount / (currentAppointmentsCount || 1)) *
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
      title: "Total Appointments",
      amount: `${totalAppointments}`,
      percentageChange: `+${percentageChange}% per year`,
      icon: <BellPlus className="size-4 text-muted-foreground" />,
    },
  ]

  return (
    <FallbackBoundary>
      <div className="p-5">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <DashboardCard items={dashboardItems} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
          <div className="col-span-4">
            <ReportsChart
              payments={payments.payments}
              unfilteredPayments={payments.payments}
              appointments={appointments.appointments}
              unfilteredAppointments={appointments.appointments}
            />
          </div>

          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle className="text-green-600">
                Recent Appointments
              </CardTitle>
              <CardDescription>
                There are {currentAppointmentsCount} appointments for this
                month.
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
