"use client"

// components
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { StatsCard } from "@/components/admin/reports/stats-card"
// import { Calendar, Clock, DollarSign } from "lucide-react"
import { Tooltip as RechartsTooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

// utils
import {
  format,
  endOfYear,
  endOfWeek,
  endOfMonth,
  startOfYear,
  startOfWeek,
  startOfMonth,
  isWithinInterval,
} from "date-fns"

// hooks
import { useState } from "react"

// types
import type { Payment, Appointment } from "@/lib/types"
import DownloadReports from "./download-reports"

interface ChartData {
  name: string
  payments: number
  bookings: number
  pending: number
}

interface ReportsChartProps {
  payments: Payment[]
  appointments: Appointment[]
}

const ReportsChart = ({ payments, appointments }: ReportsChartProps) => {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">(
    "weekly",
  )

  const processData = (
    period: "weekly" | "monthly" | "yearly",
  ): ChartData[] => {
    const now = new Date()
    let start: Date
    let end: Date
    let format_string: string

    switch (period) {
      case "weekly":
        start = startOfWeek(now)
        end = endOfWeek(now)
        format_string = "EEE"
        break
      case "monthly":
        start = startOfMonth(now)
        end = endOfMonth(now)
        format_string = "dd"
        break
      case "yearly":
        start = startOfYear(now)
        end = endOfYear(now)
        format_string = "MMM"
        break
    }

    // const interval = { start, end }

    const data: ChartData[] = []
    const datePoints = getDatesInRange(start, end, period)

    for (const date of datePoints) {
      // Filter items for current date
      const dayPayments = payments.filter((p) =>
        isWithinInterval(new Date(p.paid_date), {
          start: date,
          end: endOfDay(date),
        }),
      )

      const dayAppointments = appointments.filter((a) =>
        isWithinInterval(new Date(a.date), {
          start: date,
          end: endOfDay(date),
        }),
      )

      const pendingPayments = dayAppointments.length - dayPayments.length

      data.push({
        name: format(date, format_string),
        payments: dayPayments.length,
        bookings: dayAppointments.length,
        pending: pendingPayments > 0 ? pendingPayments : 0,
      })
    }

    return data
  }

  const chartConfig = {
    payments: {
      label: "Payments",
      theme: {
        light: "hsl(142, 76%, 36%)",
        dark: "hsl(142, 76%, 44.3%)",
      },
    },
    bookings: {
      label: "Bookings",
      theme: {
        light: "hsl(221, 83%, 53.3%)",
        dark: "hsl(217, 91%, 59.8%)",
      },
    },
    pending: {
      label: "Pending",
      theme: {
        light: "hsl(0, 84%, 60.2%)",
        dark: "hsl(0, 72%, 50.6%)",
      },
    },
  }

  const data = processData(period)

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border shadow-sm">
      <div className="flex flex-start justify-start">
        <DownloadReports payments={payments} appointments={appointments} />
      </div>

      <Tabs
        value={period}
        onValueChange={(v) => setPeriod(v as typeof period)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Chart */}
      <ChartContainer className="aspect-[16/9] mt-6" config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <XAxis
              dataKey="name"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <RechartsTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload) return null

                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-1 gap-2">
                      <p className="text-sm font-bold">{label}</p>
                      {payload.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <p className="text-sm">{item.name}</p>
                          </div>
                          <p className="text-sm font-bold">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }}
            />
            <Bar
              name="Payments"
              dataKey="payments"
              fill="var(--color-payments)"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
            <Bar
              name="Bookings"
              dataKey="bookings"
              fill="var(--color-bookings)"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
            <Bar
              name="Pending"
              dataKey="pending"
              fill="var(--color-pending)"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

export const getDatesInRange = (start: Date, end: Date, period: string) => {
  const dates: Date[] = []
  let current = start

  while (current <= end) {
    dates.push(current)
    current = addDays(current, period === "yearly" ? 30 : 1)
  }

  return dates
}

export const endOfDay = (date: Date) => {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return end
}

export const addDays = (date: Date, days: number) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export default ReportsChart
