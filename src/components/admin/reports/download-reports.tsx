"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Calendar,
  Calendar1,
  Clock,
  FileDown,
  FileChartLine,
} from "lucide-react"
import { generatePDF } from "@/components/admin/reports/pdf-generator"
import { Button } from "@/components/ui/button"

// types
import type { DownloadReportsProps } from "@/components/admin/reports/report-data"

const DownloadReports = ({ payments, appointments }: DownloadReportsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-green-500 text-white hover:bg-green-400"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Download Reports
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto">
        <DropdownMenuItem
          onClick={() => generatePDF("weekly", payments, appointments)}
          className="flex items-center px-3 py-2"
        >
          <Clock className="mr-2 size-4" />
          Weekly Report
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => generatePDF("monthly", payments, appointments)}
          className="flex items-center px-3 py-2"
        >
          <Calendar className="mr-2 size-4" />
          Monthly Report
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => generatePDF("yearly", payments, appointments)}
          className="flex items-center px-3 py-2"
        >
          <Calendar1 className="mr-2 size-4" />
          Yearly Report
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => generatePDF("agent", payments, appointments)}
          className="flex items-center px-3 py-2"
        >
          <FileChartLine className="mr-2 size-4" />
          Agent Performance Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DownloadReports
