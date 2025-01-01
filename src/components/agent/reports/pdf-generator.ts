// utils
import { processData } from "@/components/agent/reports/report-data"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"
import jsPDF from "jspdf"

// types
import type { ReportSummary } from "@/components/agent/reports/report-data"
import type { Appointment, Payment } from "@/lib/types"

const PRIMARY_COLOR: [ number, number, number ] = [ 34, 197, 94 ]
const ACCENT_COLOR: [ number, number, number ] = [ 239, 246, 255 ]

const generateAgentReport = (
  doc: jsPDF,
  appointments: Appointment[],
  payments: Payment[]
) => {
  // Initialize agent stats
  const agentStats = {} as Record<string, {
    name: string;
    // Appointment stats
    totalAppointments: number;
    confirmedAppointments: number;
    pendingAppointments: number;
    // Payment stats
    totalPayments: number;
    paidPayments: number;
    pendingPayments: number;
  }>;

  // Process appointments
  for (const appointment of appointments) {
    const agent = appointment.agent || 'Unassigned';
    if (!agentStats[ agent ]) {
      agentStats[ agent ] = {
        name: agent,
        totalAppointments: 0,
        confirmedAppointments: 0,
        pendingAppointments: 0,
        totalPayments: 0,
        paidPayments: 0,
        pendingPayments: 0
      };
    }
    agentStats[ agent ].totalAppointments++;
    if (appointment.status === 'confirmed') {
      agentStats[ agent ].confirmedAppointments++;
    } else {
      agentStats[ agent ].pendingAppointments++;
    }
  }

  // Process payments
  for (const payment of payments) {
    const agent = payment.agent || 'Unassigned';
    if (!agentStats[ agent ]) {
      agentStats[ agent ] = {
        name: agent,
        totalAppointments: 0,
        confirmedAppointments: 0,
        pendingAppointments: 0,
        totalPayments: 0,
        paidPayments: 0,
        pendingPayments: 0
      };
    }
    agentStats[ agent ].totalPayments++;
    if (payment.status === 'paid') {
      agentStats[ agent ].paidPayments++;
    } else {
      agentStats[ agent ].pendingPayments++;
    }
  }

  const sortedAgents = Object.values(agentStats)
    .sort((a, b) => b.totalAppointments - a.totalAppointments);

  const pageWidth = doc.internal.pageSize.width
  const tableWidth = 200
  const marginLeft = (pageWidth - tableWidth) / 2

  // Appointments Table
  doc.setFontSize(16)
  doc.setTextColor(...PRIMARY_COLOR)
  doc.setFont("helvetica", "bold")
  doc.text("Agent Appointments Summary", marginLeft, 55)

  autoTable(doc, {
    head: [ [ "Agent", "Total Appointments", "Confirmed", "Pending" ] ],
    body: sortedAgents.map(agent => [
      agent.name,
      agent.totalAppointments.toString(),
      agent.confirmedAppointments.toString(),
      agent.pendingAppointments.toString()
    ]),
    startY: 65,
    margin: { left: marginLeft, right: marginLeft },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      halign: 'center'
    },
    headStyles: {
      fillColor: PRIMARY_COLOR,
      fontSize: 11,
      fontStyle: "bold",
      halign: "center",
      textColor: "#FFFFFF",
      minCellHeight: 12
    },
    alternateRowStyles: { fillColor: ACCENT_COLOR },
    columnStyles: {
      0: { cellWidth: 70, halign: "left" },
      1: { cellWidth: 50, halign: "center" },
      2: { cellWidth: 40, halign: "center" },
      3: { cellWidth: 40, halign: "center" }
    }
  })

  // Payments Table
  const paymentsTableY = (doc as any).lastAutoTable.finalY + 40
  doc.setFontSize(16)
  doc.setTextColor(...PRIMARY_COLOR)
  doc.setFont("helvetica", "bold")
  doc.text("Agent Payments Summary", marginLeft, paymentsTableY)

  autoTable(doc, {
    head: [ [ "Agent", "Total Payments", "Paid", "Pending" ] ],
    body: sortedAgents.map(agent => [
      agent.name,
      agent.totalPayments.toString(),
      agent.paidPayments.toString(),
      agent.pendingPayments.toString()
    ]),
    startY: paymentsTableY + 10,
    margin: { left: marginLeft, right: marginLeft },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      halign: 'center'
    },
    headStyles: {
      fillColor: PRIMARY_COLOR,
      fontSize: 11,
      fontStyle: "bold",
      halign: "center",
      textColor: "#FFFFFF",
      minCellHeight: 12
    },
    alternateRowStyles: { fillColor: ACCENT_COLOR },
    columnStyles: {
      0: { cellWidth: 70, halign: "left" },
      1: { cellWidth: 50, halign: "center" },
      2: { cellWidth: 40, halign: "center" },
      3: { cellWidth: 40, halign: "center" }
    }
  })

  return (doc as any).lastAutoTable.finalY + 15
};

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
  PRIMARY_COLOR: [ number, number, number ],
  ACCENT_COLOR: [ number, number, number ],
) => {
  doc.setFontSize(11)
  doc.setTextColor(...PRIMARY_COLOR)
  doc.text(title, 20, yPos)

  autoTable(doc, {
    head: [ [ "User", "Description", "Status", "Date" ] ],
    body: appointments.map((a) => [ a.user, a.description, a.status, a.date ]),
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
    head: [ [ "User", "Amount", "Date" ] ],
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
  type: "weekly" | "monthly" | "yearly" | "agent",
  payments: Payment[],
  appointments: Appointment[],
) => {
  const doc = new jsPDF()
  const { data: reportData, summary } = processData(
    type,
    payments,
    appointments,
  )

  if (type === "agent") {
    // Add logo and header for agent report
    const logoBase64 = "https://ik.imagekit.io/mutd5f1xb/android-chrome-512x512.png?updatedAt=1728439897900"
    doc.addImage(logoBase64, "PNG", 20, 15, 25, 25)
    doc.setFontSize(24)
    doc.setTextColor(...PRIMARY_COLOR)
    doc.setFont("helvetica", "bold")
    doc.text("Agent Performance Report", 55, 30)
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.setFont("helvetica", "normal")
    doc.text(`Generated on: ${format(new Date(), "PPP")}`, 55, 38)

    generateAgentReport(doc, appointments, payments)
    addFooter(doc)
    doc.save(`agent-performance-report-${format(new Date(), "yyyy-MM-dd")}.pdf`)
    return
  }

  // Add logo and header
  const logoBase64 =
    "https://ik.imagekit.io/mutd5f1xb/android-chrome-512x512.png?updatedAt=1728439897900"
  doc.addImage(logoBase64, "PNG", 20, 15, 25, 25)
  doc.setFontSize(24)
  doc.setTextColor(...PRIMARY_COLOR)
  doc.setFont("helvetica", "bold")
  doc.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Report`, 55, 30)
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
  doc.save(`detailed-${type}-report-${format(new Date(), "yyyy-MM-dd")}.pdf`)
}
