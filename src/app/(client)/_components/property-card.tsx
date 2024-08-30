"use client"

// components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// utils
import { motion } from "framer-motion"
import Image from "next/image"

// types
import type { PropertyCardProps } from "@/app/(client)/constants"

const PropertyCard = ({ image, title, price }: PropertyCardProps) => (
  <motion.div
    initial="rest"
    whileHover="hover"
    animate="rest"
    className="relative overflow-hidden rounded-lg"
  >
    <Card className="group relative bg-white dark:bg-zinc-800">
      <motion.div
        className="relative w-full h-48"
        variants={{
          rest: { opacity: 1 },
          hover: { opacity: 0.3 },
        }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          className="size-full object-cover"
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity"
        variants={{
          rest: { opacity: 0, y: 20 },
          hover: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.3 }}
      >
        <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded -mt-20">
          View Property
        </Button>
      </motion.div>
      <CardContent className="p-4">
        <h3 className="font-bold text-black dark:text-white text-lg">
          {title}
        </h3>
        <p className="text-green-500 text-xl font-bold">
          ${price.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  </motion.div>
)

export default PropertyCard
