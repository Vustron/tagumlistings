"use client"

// components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// hooks
import { useRouter } from "next-nprogress-bar"

// utils
import { motion } from "framer-motion"
import Image from "next/image"

// types
import type { PropertyCardProps } from "@/app/(client)/_components/data/properties"

const PropertyCard = ({ id, image, title, price }: PropertyCardProps) => {
  const router = useRouter()

  const handleViewProperty = () => {
    router.push(`/properties/${id}`)
  }

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative overflow-hidden rounded-lg shadow-md group"
    >
      <Card className="relative bg-white dark:bg-zinc-800">
        <motion.div
          className="relative w-full h-48"
          variants={{
            rest: { opacity: 1 },
            hover: { opacity: 0.8 },
          }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={image}
            alt={title}
            width={500}
            height={500}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          variants={{
            rest: { opacity: 0, y: 20 },
            hover: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          <Button
            className="-mt-20 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={handleViewProperty}
            aria-label={`View property ${title}`}
          >
            View Property
          </Button>
        </motion.div>

        <CardContent className="p-4 text-center">
          <h3 className="font-bold text-black dark:text-white text-lg mb-2">
            {title}
          </h3>
          <p className="text-green-500 text-xl font-bold">
            ${price.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default PropertyCard
