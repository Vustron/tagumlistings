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
  ChartLegend,
  ChartTooltip,
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Monitor } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

// utils
import { getMonthName } from "@/lib/utils"

// types
import type { ChartConfig } from "@/components/ui/chart"
import type { Appointment } from "@/lib/types"

interface AppointmentsChartProps {
  appointments: Appointment[]
}

const AppointmentsChart = ({ appointments }: AppointmentsChartProps) => {
  const appointmentsByMonth = appointments.reduce(
    (acc, appointment) => {
      const month = getMonthName(new Date(appointment.date))
      acc[month] = (acc[month] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Convert the grouped data into chart data format
  const chartData = Object.keys(appointmentsByMonth).map((month) => ({
    month,
    appointments: appointmentsByMonth[month],
  }))

  // init chart config
  const chartConfig = {
    appointments: {
      label: "Appointments",
      icon: Monitor,
      theme: {
        light: "#17DE28",
        dark: "#17DE28",
      },
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-green-600">Appointments</CardTitle>
          <CardDescription>
            Showing total appointments for the last 3 months
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              minTickGap={32}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[150px]" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="appointments"
              fill="var(--color-appointments)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default AppointmentsChart
