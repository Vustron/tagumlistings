import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns"
import { getDatesInRange } from "./reports-chart"
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
    amount?: number
  }[]
}

export interface ReportSummary {
  totalPayments: number
  totalPaymentAmount: number
  totalAppointments: number
  completedAppointments: number
  pendingPayments: number
  pendingPaymentAmount: number
}

export const processData = (
  period: "weekly" | "monthly" | "yearly",
  payments: Payment[],
  appointments: Appointment[],
) => {
  const now = new Date()
  let start: Date
  let end: Date
  let format_string: string

  switch (period) {
    case "weekly":
      start = startOfWeek(now)
      end = endOfWeek(now)
      format_string = "EEE, MMM d"
      break
    case "monthly":
      start = startOfMonth(now)
      end = endOfMonth(now)
      format_string = "MMM d"
      break
    case "yearly":
      start = startOfYear(now)
      end = endOfYear(now)
      format_string = "MMM yyyy"
      break
  }

  const summary: ReportSummary = {
    totalPayments: 0,
    totalPaymentAmount: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    pendingPayments: 0,
    pendingPaymentAmount: 0,
  }

  for (const p of payments) {
    if (isWithinInterval(startOfDay(new Date(p.paid_date)), { start, end })) {
      summary.totalPayments++
      summary.totalPaymentAmount += Number(p.amount)
    }
  }

  for (const a of appointments) {
    if (isWithinInterval(startOfDay(new Date(a.date)), { start, end })) {
      summary.totalAppointments++
      if (a.status === "completed") {
        summary.completedAppointments++
      } else if (a.status === "pending") {
        summary.pendingPayments++
      }
    }
  }

  const data: DetailedReportData[] = []
  const datePoints = getDatesInRange(start, end, period)

  for (const date of datePoints) {
    const dayPayments = payments.filter((p) =>
      isWithinInterval(startOfDay(new Date(p.paid_date)), {
        start: date,
        end: endOfDay(date),
      }),
    )

    const dayAppointments = appointments.filter((a) =>
      isWithinInterval(startOfDay(new Date(a.date)), {
        start: date,
        end: endOfDay(date),
      }),
    )

    data.push({
      date: format(date, format_string),
      payments: dayPayments.map((p) => ({
        id: p.id,
        amount: p.amount,
        user: p.user,
        paid_date: format(new Date(p.paid_date), "PPp"),
      })),
      appointments: dayAppointments.map((a) => ({
        id: a.id!,
        user: a.user,
        date: format(new Date(a.date), "PPp"),
        description: a.description,
        status: a.status || "N/A",
      })),
    })
  }

  return { data, summary }
}

const addSummarySection = (
  doc: jsPDF,
  summary: ReportSummary,
  startY: number,
) => {
  let currentY = startY
  doc.setFontSize(14)
  const PRIMARY_COLOR: [number, number, number] = [34, 197, 94] // Equivalent to text-green-500

  doc.setTextColor(...PRIMARY_COLOR)
  doc.text("Summary", 20, currentY)
  currentY += 10

  autoTable(doc, {
    body: [
      [
        "Total Payments",
        `${summary.totalPayments}`,
        "Amount",
        summary.totalPaymentAmount.toString(),
      ],
      [
        "Total Appointments",
        `${summary.totalAppointments}`,
        "Completed",
        `${summary.completedAppointments}`,
      ],
      [
        "Pending Payments",
        `${summary.pendingPayments}`,
        "Amount",
        summary.pendingPaymentAmount.toString(),
      ],
    ],
    startY: currentY,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: 30, halign: "right" },
      2: { fontStyle: "bold", cellWidth: 40 },
      3: { cellWidth: 40, halign: "right" },
    },
  })

  return (doc as any).lastAutoTable.finalY + 15
}

const addAppointmentsSection = (
  doc: jsPDF,
  appointments: any[],
  title: string,
  yPos: number,
  PRIMARY_COLOR: [number, number, number],
  ACCENT_COLOR: [number, number, number],
) => {
  doc.setFontSize(11)
  doc.setTextColor(...PRIMARY_COLOR)
  doc.text(title, 20, yPos)

  autoTable(doc, {
    head: [["User", "Description", "Status", "Date"]],
    body: appointments.map((a) => [a.user, a.description, a.status, a.date]),
    startY: yPos + 2,
    margin: { left: 25, right: 25 },
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: {
      fillColor: PRIMARY_COLOR,
      fontSize: 10,
      fontStyle: "bold",
      halign: "left",
    },
    alternateRowStyles: { fillColor: ACCENT_COLOR },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 60 },
      2: { cellWidth: 30 },
      3: { cellWidth: 40 },
    },
  })

  return (doc as any).lastAutoTable.finalY + 15
}

const addFooter = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.height
  const pageWidth = doc.internal.pageSize.width

  doc.setDrawColor(34, 197, 94)
  doc.setLineWidth(0.5)
  doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30)

  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.setFont("helvetica", "normal")

  const disclaimer =
    "This report is automatically generated and confidential. The information contained herein is intended solely for the addressee. Any unauthorized use, disclosure, or distribution is strictly prohibited."
  const textWidth = pageWidth - 40
  doc.text(disclaimer, pageWidth / 2, pageHeight - 20, {
    align: "center",
    maxWidth: textWidth,
  })

  doc.setFontSize(9)
  doc.text(
    `Page ${doc.getCurrentPageInfo().pageNumber}`,
    pageWidth - 25,
    pageHeight - 10,
    { align: "right" },
  )
}

export const generatePDF = (
  period: "weekly" | "monthly" | "yearly",
  payments: Payment[],
  appointments: Appointment[],
) => {
  const doc = new jsPDF()
  const { data: reportData, summary } = processData(
    period,
    payments,
    appointments,
  )
  const PRIMARY_COLOR: [number, number, number] = [34, 197, 94]
  const SECONDARY_COLOR: [number, number, number] = [99, 102, 241]
  const ACCENT_COLOR: [number, number, number] = [239, 246, 255]

  const logoBase64 =
    "https://ik.imagekit.io/mutd5f1xb/android-chrome-512x512.png?updatedAt=1728439897900"
  doc.addImage(logoBase64, "PNG", 20, 15, 25, 25)
  doc.setFontSize(24)
  doc.setTextColor(...PRIMARY_COLOR)
  doc.setFont("helvetica", "bold")
  doc.text(`${period.charAt(0).toUpperCase() + period.slice(1)} Report`, 55, 30)
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.setFont("helvetica", "normal")
  doc.text(`Generated on: ${format(new Date(), "PPP")}`, 55, 38)
  doc.setDrawColor(...PRIMARY_COLOR)
  doc.setLineWidth(0.75)
  doc.line(20, 45, 190, 45)

  let yPos = addSummarySection(doc, summary, 55)
  doc.setDrawColor(...PRIMARY_COLOR)
  doc.setLineWidth(0.75)
  doc.line(20, yPos, 190, yPos)
  yPos += 10

  for (const day of reportData) {
    doc.setFillColor(...PRIMARY_COLOR)
    doc.rect(20, yPos - 6, 170, 8, "F")
    doc.setFontSize(12)
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.text(day.date, 25, yPos)
    yPos += 12

    if (day.payments.length > 0) {
      doc.setFontSize(11)
      doc.setTextColor(...SECONDARY_COLOR)
      doc.text("Completed Payments", 20, yPos)

      autoTable(doc, {
        head: [["User", "Amount", "Date"]],
        body: day.payments.map((p) => [p.user, p.amount, p.paid_date]),
        startY: yPos + 2,
        margin: { left: 25, right: 25 },
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: {
          fillColor: PRIMARY_COLOR,
          fontSize: 10,
          fontStyle: "bold",
          halign: "left",
        },
        alternateRowStyles: { fillColor: ACCENT_COLOR },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 40, halign: "right" },
          2: { cellWidth: 60 },
        },
      })

      yPos = (doc as any).lastAutoTable.finalY + 12
    }

    const completedAppointments = day.appointments.filter(
      (a) => a.status === "completed",
    )
    const pendingAppointments = day.appointments.filter(
      (a) => a.status === "pending",
    )

    if (completedAppointments.length > 0) {
      yPos = addAppointmentsSection(
        doc,
        completedAppointments,
        "Completed Appointments",
        yPos,
        PRIMARY_COLOR,
        ACCENT_COLOR,
      )
    }

    if (pendingAppointments.length > 0) {
      yPos = addAppointmentsSection(
        doc,
        pendingAppointments,
        "Pending Appointments",
        yPos,
        PRIMARY_COLOR,
        ACCENT_COLOR,
      )
    }

    if (yPos > 240) {
      addFooter(doc)
      doc.addPage()
      yPos = 20
    }
  }

  addFooter(doc)
  doc.save(`detailed-${period}-report-${format(new Date(), "yyyy-MM-dd")}.pdf`)
}
