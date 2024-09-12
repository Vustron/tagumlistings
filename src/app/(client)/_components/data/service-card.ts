// components
import { PaletteIcon, PresentationIcon, StoreIcon } from "lucide-react"

// types
import type { FC } from "react"

export type ServiceCardsData = {
  title: string
  description: string
  Icon: FC<{ className?: string }>
}

// TODO: placeholder paning data dri
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
  // Add more card data as needed
]
