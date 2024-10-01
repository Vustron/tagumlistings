"use client"

// components
import { PaginationWithLinks } from "@/components/ui/pagination-with-links"
import SearchBar, { fadeInUp } from "@/components/client/search/searchbar"
import PropertyCard from "@/components/layouts/client/property-card"

// utils
import { motion, AnimatePresence } from "framer-motion"

// hooks
import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"

// types
import { properties } from "@/components/client/data/properties"
import type { Filter, PropertyType } from "@/lib/types"

const SearchClient = () => {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query") || ""
  const currentPage = Number.parseInt(searchParams.get("page") || "1")
  const itemsPerPage = 6

  const [filters, setFilters] = useState<Filter>({
    types: [],
    minPrice: 0,
    maxPrice: 1000000,
  })

  const filteredProperties = useMemo(
    () =>
      properties.filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (filters.types.length === 0 ||
            filters.types.includes(property.type as PropertyType)) &&
          property.price >= filters.minPrice &&
          property.price <= filters.maxPrice,
      ),
    [searchQuery, filters],
  )

  const currentProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProperties.slice(start, start + itemsPerPage)
  }, [filteredProperties, currentPage])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold mb-8 mt-8 text-center"
      >
        Find Your Dream Property
      </motion.h1>

      <SearchBar
        initialQuery={searchQuery}
        filters={filters}
        setFilters={setFilters}
      />

      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="w-full"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold mb-6"
        >
          {searchQuery
            ? `Search Results for: "${searchQuery}"`
            : "Featured Properties"}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {currentProperties.length > 0 ? (
              currentProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="mb-5"
                >
                  <PropertyCard {...property} />
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={fadeInUp}
                className="col-span-full text-center text-gray-500 py-12"
              >
                No properties found. Try adjusting your filters.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {filteredProperties.length > itemsPerPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 mb-8"
          >
            <PaginationWithLinks
              totalCount={filteredProperties.length}
              pageSize={itemsPerPage}
              page={currentPage}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default SearchClient
