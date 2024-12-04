"use client"

// components
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import DownloadReports from "@/components/admin/reports/download-reports"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer } from "@/components/ui/chart"
import { Tooltip as RechartsTooltip } from "recharts"
import { Card } from "@/components/ui/card"

// utils
import {
  format,
  endOfYear,
  endOfMonth,
  startOfYear,
  startOfMonth,
  isWithinInterval,
} from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

// hooks
import { useState } from "react"

// types
import type { Payment, Appointment } from "@/lib/types"

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

  const getDatesInRange = (start: Date, end: Date, period: string) => {
    const dates: Date[] = []
    const current = new Date(start)

    while (current <= end) {
      dates.push(new Date(current))
      switch (period) {
        case "weekly":
          current.setDate(current.getDate() + 1)
          break
        case "monthly":
          current.setDate(current.getDate() + 1)
          break
        case "yearly":
          current.setMonth(current.getMonth() + 1)
          break
      }
    }

    return dates
  }

  const processData = (
    period: "weekly" | "monthly" | "yearly",
  ): ChartData[] => {
    const now = new Date()
    let start: Date
    let end: Date
    let format_string: string
    let datePoints: Date[] = []

    switch (period) {
      case "weekly": {
        const weekData: ChartData[] = [
          { name: "Sun", payments: 0, bookings: 0, pending: 0 },
          { name: "Mon", payments: 0, bookings: 0, pending: 0 },
          { name: "Tue", payments: 0, bookings: 0, pending: 0 },
          { name: "Wed", payments: 0, bookings: 0, pending: 0 },
          { name: "Thu", payments: 0, bookings: 0, pending: 0 },
          { name: "Fri", payments: 0, bookings: 0, pending: 0 },
          { name: "Sat", payments: 0, bookings: 0, pending: 0 },
        ]

        for (const payment of payments) {
          const paymentDate = new Date(payment.paid_date)
          const dayOfWeek = paymentDate.getDay()
          if (weekData[dayOfWeek]) {
            weekData[dayOfWeek].payments++
          }
        }

        for (const appointment of appointments) {
          const appointmentDate = new Date(appointment.date)
          const dayOfWeek = appointmentDate.getDay()
          if (weekData[dayOfWeek]) {
            weekData[dayOfWeek].bookings++

            const hasPayment = payments.some(
              (p) =>
                format(new Date(p.paid_date), "yyyy-MM-dd") ===
                format(appointmentDate, "yyyy-MM-dd"),
            )
            if (!hasPayment) {
              weekData[dayOfWeek].pending++
            }
          }
        }

        return weekData
      }

      case "monthly":
        start = startOfMonth(now)
        end = endOfMonth(now)
        format_string = "dd"
        datePoints = getDatesInRange(start, end, period)
        break
      case "yearly":
        start = startOfYear(now)
        end = endOfYear(now)
        format_string = "MMM"
        break
    }

    const data: ChartData[] = []

    if (period === "yearly") {
      Array.from({ length: 12 }).forEach((_, index) => {
        const date = new Date(now.getFullYear(), index, 1)
        data.push({
          name: format(date, format_string),
          payments: 0,
          bookings: 0,
          pending: 0,
        })
      })
    } else {
      datePoints = getDatesInRange(start, end, period)
      for (const date of datePoints) {
        data.push({
          name: format(date, format_string),
          payments: 0,
          bookings: 0,
          pending: 0,
        })
      }
    }

    // Rest of the code for monthly and yearly processing
    if (period === "monthly" || period === "yearly") {
      for (const payment of payments) {
        const paymentDate = new Date(payment.paid_date)
        if (isWithinInterval(paymentDate, { start, end })) {
          const index =
            period === "yearly"
              ? paymentDate.getMonth()
              : data.findIndex(
                  (d) =>
                    datePoints[data.indexOf(d)] &&
                    format(
                      datePoints[data.indexOf(d)] as Date,
                      format_string,
                    ) === format(paymentDate, format_string),
                )
          if (index !== -1 && data[index]) {
            data[index].payments++
          }
        }
      }

      for (const appointment of appointments) {
        const appointmentDate = new Date(appointment.date)
        if (isWithinInterval(appointmentDate, { start, end })) {
          const index =
            period === "yearly"
              ? appointmentDate.getMonth()
              : data.findIndex(
                  (d) =>
                    format(
                      datePoints[data.indexOf(d)] as Date,
                      format_string,
                    ) === format(appointmentDate, format_string),
                )
          if (index !== -1 && data[index]) {
            data[index].bookings++
            const hasPayment = payments.some(
              (p) =>
                format(new Date(p.paid_date), "yyyy-MM-dd") ===
                format(appointmentDate, "yyyy-MM-dd"),
            )
            if (!hasPayment) {
              data[index].pending++
            }
          }
        }
      }
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6 bg-card rounded-lg border shadow-sm backdrop-blur-sm bg-opacity-50"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Reports</h2>
        <DownloadReports payments={payments} appointments={appointments} />
      </div>

      <Tabs
        value={period}
        onValueChange={(v) => setPeriod(v as typeof period)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-muted/50 backdrop-blur-sm">
          <TabsTrigger
            value="weekly"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Weekly
          </TabsTrigger>
          <TabsTrigger
            value="monthly"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Monthly
          </TabsTrigger>
          <TabsTrigger
            value="yearly"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Yearly
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.div
          key={period}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-4 backdrop-blur-sm bg-card/50">
            <ChartContainer className="aspect-[16/9]" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  className="select-none"
                >
                  <XAxis
                    dataKey="name"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
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
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-lg"
                        >
                          <p className="text-sm font-medium mb-2">{label}</p>
                          <div className="space-y-1">
                            {payload.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between gap-4"
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <p className="text-sm text-muted-foreground">
                                    {item.name}
                                  </p>
                                </div>
                                <p className="text-sm font-medium">
                                  {item.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )
                    }}
                  />
                  <Bar
                    dataKey="payments"
                    name="Payments"
                    fill="var(--color-payments)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="bookings"
                    name="Bookings"
                    fill="var(--color-bookings)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="pending"
                    name="Pending"
                    fill="var(--color-pending)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
        </motion.div>
      </AnimatePresence>
    </motion.div>
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
