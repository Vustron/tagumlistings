"use client"

// components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaletteIcon, PresentationIcon, StoreIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

// utils
import { motion } from "framer-motion"

// types
import type { ServiceCardsData } from "@/lib/types"

export const serviceCardsData: ServiceCardsData[] = [
  {
    title: "Build your portfolio",
    description: "The simplest way to keep your portfolio always up-to-date.",
    Icon: PaletteIcon,
  },
  {
    title: "Get freelance work",
    description: "New design projects delivered to your inbox each morning.",
    Icon: PresentationIcon,
  },
  {
    title: "Sell your goods",
    description:
      "Get your goods in front of millions of potential customers with ease.",
    Icon: StoreIcon,
  },
]

interface ServiceCardProps {
  title: string
  description: string
  Icon: React.ElementType
  link?: string
}

const ServiceCard = ({ title, description, Icon }: ServiceCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-4">
          <motion.div
            className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-primary mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="flex-shrink-0 w-8 h-8 text-primary-foreground" />
          </motion.div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {description}
          </p>
          <Button variant="outline" className="mt-auto">
            Learn More
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const ServiceCards = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-10 mb-10"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl font-bold text-center mb-8"
      >
        Our Services
      </motion.h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {serviceCardsData.map((card, index) => (
          <ServiceCard
            key={index}
            title={card.title}
            description={card.description}
            Icon={card.Icon}
            link={`/services/${card.title.toLowerCase().replace(/\s+/g, "-")}`}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default ServiceCards
