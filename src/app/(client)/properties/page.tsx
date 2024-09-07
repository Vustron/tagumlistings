"use client"

// components
import PropertyCard from "@/app/(client)/_components/property-card"

// hooks
import { useSearchParams } from "next/navigation"

// utils
import { motion } from "framer-motion"
import { properties } from "@/app/(client)/constants"
import { PaginationWithLinks } from "@/components/ui/pagination-with-links"

// types
import type { PropertyCardProps } from "@/app/(client)/constants"

export default function Properties() {
  const searchParams = useSearchParams()

  const currentPage = Number.parseInt(searchParams.get("page") || "1")
  const itemsPerPage = 8

  const indexOfLastProperty = currentPage * itemsPerPage
  const indexOfFirstProperty = indexOfLastProperty - itemsPerPage
  const currentProperties = properties.slice(
    indexOfFirstProperty,
    indexOfLastProperty,
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="font-sans min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white">
      <main className="mx-auto pt-8 pb-16 max-w-7xl px-4 relative z-10">
        <motion.h2
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Properties
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {currentProperties.map((property: PropertyCardProps) => (
            <motion.div key={property.id} variants={itemVariants}>
              <PropertyCard {...property} />
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <PaginationWithLinks
            totalCount={properties.length}
            pageSize={itemsPerPage}
            page={currentPage}
          />
        </motion.div>
      </main>
    </div>
  )
}
