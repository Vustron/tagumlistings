"use client"

// components
import { PaginationWithLinks } from "@/components/ui/pagination-with-links"
import PropertyCard from "@/components/layouts/client/property-card"
import FallbackBoundary from "@/components/shared/fallback-boundary"
import SearchBar from "@/components/client/search/searchbar"
import { Button } from "@/components/ui/button"
import { Loader2, FilterX } from "lucide-react"

// hooks
import { useSearchClient } from "@/components/client/search/use-search-client"

// utils
import {
  containerVariants,
  itemVariants,
} from "@/components/client/search/animation-variants"
import { motion, AnimatePresence } from "framer-motion"

const SearchClient = () => {
  const {
    query,
    filters,
    setFilters,
    handleFilterChange,
    clearFilters,
    showSoldProperties,
    setShowSoldProperties,
    isLoading,
    displayProperties,
    totalCount,
    totalPages,
    currentPage,
  } = useSearchClient()

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
          filters={filters}
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
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 dark:bg-black dark:hover:bg-green-400 text-white"
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
                displayProperties.map((property, index) => (
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
                pageSize={9}
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
