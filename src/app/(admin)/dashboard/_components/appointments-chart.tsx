"use client"

// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Monitor } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

// types
import type { ChartConfig } from "@/components/ui/chart"

const AppointmentsChart = () => {
  // chart data
  const chartData = [
    { month: "January", appointments: 186 },
    { month: "February", appointments: 305 },
    { month: "March", appointments: 237 },
    { month: "April", appointments: 73 },
    { month: "May", appointments: 209 },
    { month: "June", appointments: 214 },
  ]

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
