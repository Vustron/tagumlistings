import type { BedDouble } from "lucide-react"

const PropertyMetric = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BedDouble
  label: string
  value: string | undefined
}) => (
  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
    <Icon className="size-5" />
    <span className="font-medium">{label}:</span>
    <span>{value || "N/A"}</span>
  </div>
)

export default PropertyMetric
