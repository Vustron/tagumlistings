// components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// utils
import { serviceCardsData } from "@/app/(client)/constants"

// types
import type { FC } from "react"

const ServiceCards: FC = () => {
  return (
    <>
      <div className="container py-24 lg:py-32">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 items-center gap-6 md:gap-10">
          {serviceCardsData.map((card, index) => (
            <Card key={index}>
              <CardHeader className="pb-4 flex-row items-center gap-4">
                <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                  <card.Icon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>{card.description}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}

export default ServiceCards
