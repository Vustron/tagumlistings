"use client"

// components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import PropertyCard from "@/app/(client)/_components/property-card"
import { PaginationWithLinks } from "@/components/ui/pagination-with-links"

// utils
import { motion, AnimatePresence } from "framer-motion"

// hooks
import { useRouter } from "next-nprogress-bar"
import { useSearchParams } from "next/navigation"
import { useState, useMemo } from "react"

// types
import { properties } from "@/app/(client)/constants"
import { Search, X } from "lucide-react"

export const propertyTypes = ["House", "Apartment", "Land", "Commercial"]

const MotionInput = motion(Input)
const MotionButton = motion(Button)

const SearchBar = ({
  initialQuery,
  selectedFilters,
  setSelectedFilters,
}: {
  initialQuery: string
  selectedFilters: string[]
  setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>
}) => {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`)
    }
  }

  const toggleFilter = (type: string) => {
    setSelectedFilters((prev) => {
      return prev.includes(type)
        ? prev.filter((filter) => filter !== type)
        : [...prev, type]
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mb-6"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <MotionInput
            type="text"
            placeholder="Search properties..."
            value={query}
            aria-label="Search properties input"
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow text-black dark:text-white bg-white dark:bg-gradient-to-br from-green-950 to-blue-950 border border-green-900 dark:border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <MotionButton
            type="submit"
            aria-label="Search properties button"
            className="ml-2 text-white dark:text-white bg-gradient-to-br from-green-950 to-blue-950 dark:from-green-500 dark:to-green-900 border border-green-900 dark:border-green-300 hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="mr-2" />
            Search
          </MotionButton>
        </div>
      </form>

      <motion.div
        className="mt-4 flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {propertyTypes.map((type) => (
          <MotionButton
            key={type}
            onClick={() => toggleFilter(type)}
            className={`dark:text-black dark:hover:text-black hover:text-white px-3 py-1 rounded-lg text-sm transition-colors ${
              selectedFilters.includes(type)
                ? "bg-green-600 text-white dark:text-white"
                : "bg-gray-200 text-black hover:text-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {type}
          </MotionButton>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {selectedFilters.map((filter) => (
              <motion.div
                key={filter}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center px-2 py-1 rounded-lg bg-green-100 dark:bg-green-800"
              >
                {filter}
                <MotionButton
                  size={"sm"}
                  onClick={() =>
                    setSelectedFilters(
                      selectedFilters.filter((f) => f !== filter),
                    )
                  }
                  className="ml-2 text-sm rounded-full bg-transparent p-1 hover:bg-transparent"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="size-3 text-red-500" />
                </MotionButton>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const SearchClient = () => {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query") || ""
  const currentPage = Number.parseInt(searchParams.get("page") || "1")
  const itemsPerPage = 3

  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const filteredProperties = useMemo(
    () =>
      properties.filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (selectedFilters.length === 0 ||
            selectedFilters.includes(property.type)),
      ),
    [searchQuery, selectedFilters],
  )

  const currentProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProperties.slice(start, start + itemsPerPage)
  }, [filteredProperties, currentPage, itemsPerPage])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-6 mt-5"
      >
        Property Search
      </motion.h1>

      <SearchBar
        initialQuery={searchQuery}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 w-full"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-semibold mb-4"
        >
          {searchQuery
            ? `Search Results for: "${searchQuery}"`
            : "All Properties"}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {currentProperties.length > 0 ? (
              currentProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <PropertyCard {...property} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="col-span-full text-center text-gray-500"
              >
                No properties found.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {filteredProperties.length > itemsPerPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-5 mb-5"
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
