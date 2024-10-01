"use client"

// components
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import {
  BellPlus,
  BookMarked,
  MapPinHouse,
  CircleDollarSign,
} from "lucide-react"
import { ErrorFallback, LoadingFallback } from "@/components/shared/fallback"
import AppointmentsChart from "@/components/admin/appointments/chart"
import AppointmentsList from "@/components/admin/appointments/list"
import DashboardCard from "@/components/admin/dashboard/card"

// hooks
import { useGetAppointments } from "@/lib/hooks/appointment/get-all"
import { useGetProperties } from "@/lib/hooks/property/get-all"

// utils
import {
  filterAppointmentsForLastHour,
  filterAppointmentsForCurrentMonth,
} from "@/lib/utils"
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"

// utils
import type { Property } from "@/lib/types"

const AdminDashboardClient = () => {
  const { data: appointmentsData } = useGetAppointments()
  const { data: propertiesData } = useGetProperties()

  const appointments = appointmentsData?.appointments ?? []
  const currentMonthAppointments =
    filterAppointmentsForCurrentMonth(appointments)
  const lastHourAppointments = filterAppointmentsForLastHour(appointments)
  const appointmentsCount = currentMonthAppointments.length
  const lastHourAppointmentsCount = lastHourAppointments.length

  const properties = propertiesData?.properties ?? []
  const propertiesCount = properties.length

  const reservedProperties = properties.filter(
    (property: Property) => property.status === "reserved",
  ).length

  const soldProperties = properties.filter(
    (property: Property) => property.status === "sold",
  ).length

  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)

  const propertiesLastMonth = properties.filter(
    (property: Property) =>
      property.created_at && new Date(property.created_at) >= lastMonth,
  ).length

  const propertiesChange = propertiesCount - propertiesLastMonth
  const propertiesPercentageChange = (
    (propertiesChange / (propertiesLastMonth || 1)) *
    100
  ).toFixed(2)
  const propertiesChangeSign = propertiesChange >= 0 ? "+" : ""

  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)

  const reservedPropertiesLastWeek = properties.filter(
    (property: Property) =>
      property.status === "reserved" &&
      property.created_at &&
      new Date(property.created_at) >= lastWeek,
  ).length

  const reservedPropertiesChangeSign =
    reservedPropertiesLastWeek >= 0 ? "+" : ""

  const soldPropertiesLastMonth = properties.filter(
    (property: Property) =>
      property.status === "sold" &&
      property.created_at &&
      new Date(property.created_at) >= lastMonth,
  ).length

  const soldPropertiesChange = soldProperties - soldPropertiesLastMonth
  const soldPropertiesPercentageChange = (
    (soldPropertiesChange / (soldPropertiesLastMonth || 1)) *
    100
  ).toFixed(2)
  const soldPropertiesChangeSign = soldPropertiesChange >= 0 ? "+" : ""

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
      title: "Reserved",
      amount: `${reservedProperties}`,
      percentageChange: `${reservedPropertiesChangeSign}${reservedPropertiesLastWeek} this week`,
      icon: <BookMarked className="size-4 text-muted-foreground" />,
    },
    {
      id: "3",
      title: "Sold",
      amount: `${soldProperties}`,
      percentageChange: `${soldPropertiesChangeSign}${soldPropertiesPercentageChange}% from last month`,
      icon: <CircleDollarSign className="size-4 text-muted-foreground" />,
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
    <div className="p-5">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingFallback />}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard items={dashboardItems} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
            <div className="col-span-4">
              <AppointmentsChart appointments={appointments} />
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
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default AdminDashboardClient
