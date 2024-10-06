"use client"

// components
import { PaginationWithLinks } from "@/components/ui/pagination-with-links"
import SearchBar, { fadeInUp } from "@/components/client/search/searchbar"
import PropertyCard from "@/components/layouts/client/property-card"
import FallbackBoundary from "@/components/shared/fallback-boundary"

// hooks
import { useGetProperties } from "@/lib/hooks/property/get-all"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next-nprogress-bar"
import { useState, useEffect } from "react"

// utils
import { motion, AnimatePresence } from "framer-motion"

// types
import type { Filter, Property } from "@/lib/types"

const SearchClient = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1
  const itemsPerPage = 9
  const query = searchParams.get("query") || ""

  // Initialize filters from URL params
  const initialFilters: Partial<Filter> = {
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    status: searchParams.get("status") || "",
  }

  const [filters, setFilters] = useState<Partial<Filter>>(initialFilters)

  // Fetch properties based on query
  const { data, isLoading } = useGetProperties(currentPage, itemsPerPage, query)
  const totalCount = data?.pagination?.total || 0
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  // Filter properties based on filters
  const filteredProperties =
    data?.properties.filter((property: Property) => {
      const matchesLocation = filters.location
        ? (property.location ?? "").includes(filters.location)
        : true
      const matchesStatus = filters.status
        ? property.status === filters.status
        : true

      return matchesLocation && matchesStatus
    }) || []

  useEffect(() => {
    const params = new URLSearchParams()

    params.set("page", currentPage.toString())
    if (query) params.set("query", query)

    // Only add filter params if they have values
    if (filters.category) params.set("category", filters.category)
    if (filters.location) params.set("location", filters.location)
    if (filters.status) params.set("status", filters.status)

    // If there are no filters, just keep the page and query parameters
    const queryString = params.toString()
    router.push(queryString ? `?${queryString}` : "")
  }, [filters, currentPage, query, router])

  const handleFilterChange = (filterType: keyof Filter, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: "",
      location: "",
      status: "",
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading properties...</p>
      </div>
    )
  }

  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <FallbackBoundary>
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
          initialQuery={query}
          filters={filters as Filter}
          setFilters={setFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {paginatedProperties.length > 0 ? (
                paginatedProperties.map((property: Property, index: number) => (
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

          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 mb-8"
            >
              <PaginationWithLinks
                totalCount={totalCount}
                pageSize={itemsPerPage}
                page={currentPage}
              />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </FallbackBoundary>
  )
}

export default SearchClient
