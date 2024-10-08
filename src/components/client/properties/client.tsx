"use client"

// components
import { PaginationWithLinks } from "@/components/ui/pagination-with-links"
import FallbackBoundary from "@/components/shared/fallback-boundary"
import PropertyCard from "@/components/layouts/client/property-card"

// hooks
import { useGetProperties } from "@/lib/hooks/property/get-all"
import { useSearchParams } from "next/navigation"

// utils
import { motion, AnimatePresence } from "framer-motion"

// types
import type { Property } from "@/lib/types"

const PropertiesClient = () => {
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1
  const itemsPerPage = 9

  // Fetch all properties
  const { data, isLoading } = useGetProperties()

  const allProperties = data?.properties || []
  const totalCount = allProperties.length
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  // Client-side pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProperties = allProperties.slice(startIndex, endIndex)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading properties...</p>
      </div>
    )
  }

  // Animation variants
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
    <FallbackBoundary>
      <motion.h2
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Properties
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {currentProperties.length > 0 ? (
            currentProperties.map((property: Property, index: number) => (
              <motion.div
                key={property.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <PropertyCard {...property} />
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={itemVariants}
              className="col-span-full text-center text-gray-500 py-12"
            >
              No properties found.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {totalPages > 1 && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <PaginationWithLinks
            totalCount={totalCount}
            pageSize={itemsPerPage}
            page={currentPage}
          />
        </motion.div>
      )}
    </FallbackBoundary>
  )
}

export default PropertiesClient
