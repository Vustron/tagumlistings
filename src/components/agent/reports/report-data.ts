import {
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
  isWithinInterval,
  endOfDay,
  startOfDay,
  startOfWeek,
  endOfWeek,
} from "date-fns"
import type { Appointment, Payment } from "@/lib/types"

export interface DownloadReportsProps {
  payments: Payment[]
  appointments: Appointment[]
}

export interface DetailedReportData {
  date: string
  payments: {
    id: string
    amount: string
    user: string
    paid_date: string
  }[]
  appointments: {
    id: string
    user: string
    date: string
    description: string
    status: string
  }[]
}

export interface ReportSummary {
  totalPayments: number
  totalPaymentAmount: number
  totalAppointments: number
  completedAppointments: number
  pendingPayments: number
}

const getDatesInRange = (start: Date, end: Date, period: string): Date[] => {
  const dates: Date[] = []
  const current = new Date(start)

  while (current <= end) {
    dates.push(new Date(current))
    switch (period) {
      case "weekly":
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

const isValidDate = (date: any): boolean => {
  const parsedDate = new Date(date)
  return !Number.isNaN(parsedDate.getTime())
}

export const processData = (
  period: "weekly" | "monthly" | "yearly",
  payments: Payment[],
  appointments: Appointment[],
) => {
  const now = new Date()
  let start: Date = now
  let end: Date = now
  let format_string: string = ""
  let data: DetailedReportData[] = []

  // Filter valid dates and parse dates
  const filteredPayments = payments
    .filter((p) => p.paid_date && isValidDate(p.paid_date))
    .map((p) => ({
      ...p,
      paid_date: new Date(p.paid_date),
    }))

  const filteredAppointments = appointments
    .filter((a) => a.date && isValidDate(a.date))
    .map((a) => ({
      ...a,
      date: new Date(a.date),
    }))

  // Calculate summary
  const summary: ReportSummary = {
    totalPayments: filteredPayments.length,
    totalPaymentAmount: filteredPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0,
    ),
    totalAppointments: filteredAppointments.length,
    completedAppointments: filteredAppointments.filter(
      (a) => a.status === "completed",
    ).length,
    pendingPayments: filteredAppointments.filter((a) => a.status === "pending")
      .length,
  }

  switch (period) {
    case "weekly": {
      start = startOfWeek(now, { weekStartsOn: 0 })
      end = endOfWeek(now, { weekStartsOn: 0 })
      const weekDays = [
        { name: "Sun", shortName: "Sunday" },
        { name: "Mon", shortName: "Monday" },
        { name: "Tue", shortName: "Tuesday" },
        { name: "Wed", shortName: "Wednesday" },
        { name: "Thu", shortName: "Thursday" },
        { name: "Fri", shortName: "Friday" },
        { name: "Sat", shortName: "Saturday" },
      ]

      data = weekDays.map((day) => ({
        date: day.shortName,
        payments: filteredPayments
          .filter(
            (p) =>
              p.paid_date.getDay() ===
              weekDays.findIndex((d) => d.name === day.name),
          )
          .map((p) => ({
            id: p.id,
            amount: p.amount,
            user: p.user,
            paid_date: format(p.paid_date, "PPp"),
          })),
        appointments: filteredAppointments
          .filter(
            (a) =>
              a.date.getDay() ===
              weekDays.findIndex((d) => d.name === day.name),
          )
          .map((a) => ({
            id: a.id || "",
            user: a.user,
            date: format(a.date, "PPp"),
            description: a.description,
            status: a.status || "N/A",
          })),
      }))
      break
    }

    case "monthly": {
      start = startOfMonth(now)
      end = endOfMonth(now)
      format_string = "MMM d"
      break
    }

    case "yearly": {
      start = startOfYear(now)
      end = endOfYear(now)
      format_string = "MMMM"
      break
    }
  }

  if (period === "monthly" || period === "yearly") {
    const datePoints = getDatesInRange(start, end, period)
    data = datePoints.map((date) => ({
      date: format(date, format_string),
      payments: filteredPayments
        .filter((p) => {
          if (period === "yearly") {
            return p.paid_date.getMonth() === date.getMonth()
          }
          return isWithinInterval(startOfDay(p.paid_date), {
            start: startOfDay(date),
            end: endOfDay(date),
          })
        })
        .map((p) => ({
          id: p.id,
          amount: p.amount,
          user: p.user,
          paid_date: format(p.paid_date, "PPp"),
        })),
      appointments: filteredAppointments
        .filter((a) => {
          if (period === "yearly") {
            return a.date.getMonth() === date.getMonth()
          }
          return isWithinInterval(startOfDay(a.date), {
            start: startOfDay(date),
            end: endOfDay(date),
          })
        })
        .map((a) => ({
          id: a.id || "",
          user: a.user,
          date: format(a.date, "PPp"),
          description: a.description,
          status: a.status || "N/A",
        })),
    }))
  }

  return { data, summary }
}
