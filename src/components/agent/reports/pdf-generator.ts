// utils
import { processData } from "@/components/agent/reports/report-data"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"
import jsPDF from "jspdf"

// types
import type { ReportSummary } from "@/components/agent/reports/report-data"
import type { Appointment, Payment } from "@/lib/types"

const PRIMARY_COLOR: [number, number, number] = [34, 197, 94]
const ACCENT_COLOR: [number, number, number] = [239, 246, 255]

const addSummarySection = (
  doc: jsPDF,
  summary: ReportSummary,
  startY: number,
) => {
  let currentY = startY
  doc.setFontSize(14)
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
        summary.pendingPayments.toString(),
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

const addPaymentsSection = (
  doc: jsPDF,
  payments: Array<{
    id: string
    amount: string | number
    user: string
    paid_date: string
  }>,
  yPos: number,
) => {
  doc.setFontSize(11)
  doc.setTextColor(...PRIMARY_COLOR)
  doc.text("Payments", 20, yPos)

  autoTable(doc, {
    head: [["User", "Amount", "Date"]],
    body: payments.map((p) => [
      p.user,
      typeof p.amount === "string" ? p.amount : p.amount.toFixed(2),
      p.paid_date,
    ]),
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
      2: { cellWidth: 50 },
    },
  })

  return (doc as any).lastAutoTable.finalY + 15
}

const addFooter = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.height
  const pageWidth = doc.internal.pageSize.width

  doc.setDrawColor(...PRIMARY_COLOR)
  doc.setLineWidth(0.5)
  doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30)

  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.setFont("helvetica", "normal")

  const disclaimer =
    "This report is automatically generated and confidential. The information contained herein is intended solely for the addressee. Any unauthorized use, disclosure, or distribution is strictly prohibited."
  doc.text(disclaimer, pageWidth / 2, pageHeight - 20, {
    align: "center",
    maxWidth: pageWidth - 40,
  })

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

  // Add logo and header
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

  // Add content
  let yPos = addSummarySection(doc, summary, 55)
  doc.setDrawColor(...PRIMARY_COLOR)
  doc.setLineWidth(0.75)
  doc.line(20, yPos, 190, yPos)
  yPos += 10

  // Add daily sections
  for (const day of reportData) {
    if (yPos > 240) {
      addFooter(doc)
      doc.addPage()
      yPos = 20
    }

    // Add day header
    doc.setFillColor(...PRIMARY_COLOR)
    doc.rect(20, yPos - 6, 170, 8, "F")
    doc.setFontSize(12)
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.text(day.date, 25, yPos)
    yPos += 12

    // Add payments section
    if (day.payments.length > 0) {
      yPos = addPaymentsSection(doc, day.payments, yPos)
    }

    if (day.appointments.length > 0) {
      yPos = addAppointmentsSection(
        doc,
        day.appointments,
        "Appointments",
        yPos,
        PRIMARY_COLOR,
        ACCENT_COLOR,
      )
    }
  }

  addFooter(doc)
  doc.save(`detailed-${period}-report-${format(new Date(), "yyyy-MM-dd")}.pdf`)
}
