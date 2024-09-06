// components
import { PaletteIcon, PresentationIcon, StoreIcon } from "lucide-react"

// types
import type { FC } from "react"

export type PropertyCardProps = {
  id: string | number
  image: string
  title: string
  type: string
  price: number
}

export const properties: PropertyCardProps[] = [
  {
    id: "1",
    image: "/images/image1.jpg",
    title: "Modern Apartment",
    type: "Commercial",
    price: 250000,
  },
  {
    id: "2",
    image: "/images/image2.jpg",
    title: "Cozy House",
    type: "Commercial",
    price: 350000,
  },
  {
    id: "3",
    image: "/images/image3.jpg",
    title: "Luxury Villa",
    type: "Commercial",
    price: 750000,
  },
  {
    id: "4",
    image: "/images/image4.jpg",
    title: "Downtown Condo",
    type: "Land",
    price: 450000,
  },
  {
    id: "5",
    image: "/images/image1.jpg",
    title: "Suburban Home",
    type: "Land",
    price: 550000,
  },
  {
    id: "6",
    image: "/images/image2.jpg",
    title: "Beachfront Property",
    type: "Land",
    price: 950000,
  },
  {
    id: "7",
    image: "/images/image3.jpg",
    title: "Beachfront Property",
    type: "Apartment",
    price: 950000,
  },
  {
    id: "8",
    image: "/images/image4.jpg",
    title: "Beachfront Property",
    type: "Apartment",
    price: 950000,
  },
  {
    id: "9",
    image: "/images/image4.jpg",
    title: "Beachfront Property",
    type: "Apartment",
    price: 950000,
  },
  {
    id: "10",
    image: "/images/image4.jpg",
    title: "Beachfront Property",
    type: "House",
    price: 950000,
  },
  {
    id: "11",
    image: "/images/image4.jpg",
    title: "Beachfront Property",
    type: "House",
    price: 950000,
  },
  {
    id: "12",
    image: "/images/image4.jpg",
    title: "Beachfront Property",
    type: "House",
    price: 950000,
  },
]

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
