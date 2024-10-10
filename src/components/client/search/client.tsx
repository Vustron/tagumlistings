"use client"

// components
import { PaginationWithLinks } from "@/components/ui/pagination-with-links"
import PropertyCard from "@/components/layouts/client/property-card"
import FallbackBoundary from "@/components/shared/fallback-boundary"
import SearchBar from "@/components/client/search/searchbar"
import { Button } from "@/components/ui/button"
import { Loader2, FilterX } from "lucide-react"

// hooks
import { useGetProperties } from "@/lib/hooks/property/get-all"
import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next-nprogress-bar"

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
  const [showSoldProperties, setShowSoldProperties] = useState(false)

  // Initialize filters from URL params
  const initialFilters: Partial<Filter> = {
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    status: searchParams.get("status") || "",
  }

  const [filters, setFilters] = useState<Partial<Filter>>(initialFilters)

  // Determine if we should use pagination
  const shouldPaginate =
    query || Object.values(filters).some((value) => value !== "")

  // Fetch properties based on whether we need pagination
  const { data, isLoading } = shouldPaginate
    ? useGetProperties({
        page: currentPage,
        limit: itemsPerPage,
        query,
      })
    : useGetProperties()

  // Filter and memoize properties
  const filteredProperties = useMemo(() => {
    if (!data?.properties) return []

    return data.properties.filter((property: Property) => {
      if (!property) return false

      // First check if we should show sold properties
      if (!showSoldProperties && property.status?.toLowerCase() === "sold") {
        return false
      }

      const matchesCategory = filters.category
        ? property.category === filters.category
        : true
      const matchesLocation = filters.location
        ? (property.location ?? "")
            .toLowerCase()
            .includes(filters.location.toLowerCase())
        : true
      const matchesStatus = filters.status
        ? property.status === filters.status
        : true

      return matchesCategory && matchesLocation && matchesStatus
    })
  }, [data?.properties, filters, showSoldProperties])

  const totalCount = filteredProperties.length
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  // Client-side pagination
  const displayProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return shouldPaginate
      ? filteredProperties
      : filteredProperties.slice(startIndex, endIndex)
  }, [currentPage, filteredProperties, shouldPaginate])

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

  // Update URL params when filters or page changes
  useEffect(() => {
    const params = new URLSearchParams()

    if (currentPage > 1) {
      params.set("page", currentPage.toString())
    }

    if (query) {
      params.set("query", query)
    }

    // Add filter params if they have values
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params.set(key, value)
      }
    }

    // Update URL without reloading the page
    const queryString = params.toString()
    router.push(queryString ? `/search?${queryString}` : "/search", {
      scroll: false,
    })
  }, [filters, currentPage, query, router])

  const handleFilterChange = (filterType: keyof Filter, value: string) => {
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
    router.push("/search")
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 space-y-6"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mt-8 text-center"
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

        <div className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.h2
              className="text-3xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Search Results
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({totalCount} {totalCount === 1 ? "property" : "properties"})
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                onClick={() => setShowSoldProperties(!showSoldProperties)}
                variant={showSoldProperties ? "default" : "outline"}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 dark:bg-black dark:hover:bg-green-400"
              >
                <FilterX className="size-4" />
                {showSoldProperties ? "Show All" : "Hide Sold Properties"}
              </Button>
            </motion.div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="wait">
              {displayProperties.length > 0 ? (
                displayProperties.map((property: Property, index: number) => (
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
                  {!showSoldProperties && (
                    <Button
                      variant="outline"
                      onClick={() => setShowSoldProperties(true)}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 mb-8"
            >
              <PaginationWithLinks
                totalCount={totalCount}
                pageSize={itemsPerPage}
                page={currentPage}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </FallbackBoundary>
  )
}

export default SearchClient
