"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Calendar, Calendar1, Clock, FileDown } from "lucide-react"

import { generatePDF } from "./report-utils"

import type { DownloadReportsProps } from "./report-utils"

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
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem
          onClick={() => generatePDF("weekly", payments, appointments)}
          className="flex items-center px-3 py-2"
        >
          <Clock className="mr-2 h-4 w-4" />
          Weekly Report
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => generatePDF("monthly", payments, appointments)}
          className="flex items-center px-3 py-2"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Monthly Report
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => generatePDF("yearly", payments, appointments)}
          className="flex items-center px-3 py-2"
        >
          <Calendar1 className="mr-2 h-4 w-4" />
          Yearly Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DownloadReports
