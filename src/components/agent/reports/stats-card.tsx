import { cn } from "@/lib/utils"

import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: number
  icon: ReactNode
  className?: string
}

export const StatsCard = ({
  title,
  value,
  icon,
  className,
}: StatsCardProps) => {
  return (
    <div className={cn("p-4 rounded-lg", className)}>
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  )
}
