// components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPercentageChangeColor } from "@/lib/utils"

interface DashboardCardItemProps {
  id: string
  title: string
  amount: string
  percentageChange: string
  icon?: React.ReactNode
}

interface DashboardCardProps {
  items: DashboardCardItemProps[]
}

const DashboardCard = ({ items }: DashboardCardProps) => {
  return (
    <>
      {items.map((item) => (
        <Card key={item.id} className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <span className="ml-3 text-muted-foreground">{item.icon}</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{item.amount}</div>
            <p
              className={`text-xs ${getPercentageChangeColor(item.percentageChange)}`}
            >
              {item.percentageChange}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export default DashboardCard
