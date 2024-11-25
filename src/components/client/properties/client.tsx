"use client"

// components
import { PaginationWithLinks } from "@/components/ui/pagination-with-links"
import FallbackBoundary from "@/components/shared/fallback-boundary"
import PropertyCard from "@/components/layouts/client/property-card"
import { Button } from "@/components/ui/button"
import { Loader2, FilterX } from "lucide-react"
import { Input } from "@/components/ui/input"

// hooks
import { useGetProperties } from "@/lib/hooks/property/get-all"
import { useSearchParams } from "next/navigation"
import { useState, useMemo } from "react"

// utils
import { motion, AnimatePresence } from "framer-motion"

// types
import type { Property } from "@/lib/types"

const PropertiesClient = () => {
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1
  const itemsPerPage = 9
  const [showAllProperties, setShowAllProperties] = useState(false)
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()

  // Fetch all properties
  const { data, isLoading } = useGetProperties()

  // Filter and memoize properties
  const filteredProperties = useMemo(() => {
    if (!data?.properties) return []
    return data.properties.filter((property: Property) => {
      const price = Number.parseFloat(property.price || "0")
      const isWithinPriceRange =
        (minPrice === undefined || price >= minPrice) &&
        (maxPrice === undefined || price <= maxPrice)
      return (
        isWithinPriceRange &&
        (showAllProperties
          ? true
          : property.status?.toLowerCase() !== "sold" &&
            property.status?.toLowerCase() !== "reserved")
      )
    })
  }, [data?.properties, showAllProperties, minPrice, maxPrice])

  const totalCount = filteredProperties.length
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  // Client-side pagination
  const currentProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredProperties.slice(startIndex, endIndex)
  }, [currentPage, filteredProperties])

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="size-8 animate-spin text-gray-500" />
        <p className="text-gray-500">Loading properties...</p>
      </div>
    )
  }

  return (
    <FallbackBoundary>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.h2
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Properties
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({totalCount} {totalCount === 1 ? "property" : "properties"})
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col w-full sm:w-auto gap-4"
          >
            {/* Completely restructured inputs container */}
            <div className="flex flex-col w-full gap-2">
              <Input
                type="number"
                placeholder="Min Price"
                value={minPrice ?? ""}
                min={0}
                onChange={(e: { target: { value: string } }) =>
                  setMinPrice(
                    e.target.value && Number.parseFloat(e.target.value) >= 0
                      ? Number.parseFloat(e.target.value)
                      : undefined,
                  )
                }
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={maxPrice ?? ""}
                min={0}
                onChange={(e: { target: { value: string } }) =>
                  setMaxPrice(
                    e.target.value && Number.parseFloat(e.target.value) >= 0
                      ? Number.parseFloat(e.target.value)
                      : undefined,
                  )
                }
                className="w-full"
              />
            </div>
            <Button
              onClick={() => setShowAllProperties(!showAllProperties)}
              variant={showAllProperties ? "default" : "outline"}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 dark:bg-black dark:hover:bg-green-400 text-white w-full"
            >
              <FilterX className="size-4" />
              {showAllProperties
                ? "Hide Sold & Reserved"
                : "Show All Properties"}
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {currentProperties.length > 0 ? (
              currentProperties.map((property: Property, index: number) => (
                <motion.div
                  key={property.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <PropertyCard {...property} />
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className="col-span-full flex flex-col items-center justify-center py-12 space-y-4 text-gray-500"
                initial="hidden"
                animate="visible"
              >
                <FilterX className="size-12 mb-2" />
                <p className="text-lg font-medium">No properties found</p>
                {!showAllProperties && (
                  <Button
                    variant="outline"
                    onClick={() => setShowAllProperties(true)}
                    className="mt-2"
                  >
                    Show All Properties
                  </Button>
                )}
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
      </div>
    </FallbackBoundary>
  )
}

export default PropertiesClient
