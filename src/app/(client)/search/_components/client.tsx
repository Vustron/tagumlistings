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
import { useState, useEffect } from "react"

// types
import { properties, type PropertyCardProps } from "@/app/(client)/constants"

const SearchBar = ({ initialQuery }: { initialQuery: string }) => {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mb-6">
      <div className="flex">
        <Input
          type="text"
          placeholder="Search properties..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow"
        />
        <Button
          type="submit"
          className="ml-2 text-black dark:text-white bg-white dark:bg-gradient-to-br from-green-950 to-blue-950 border border-green-900 dark:border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 hover:text-white"
        >
          Search
        </Button>
      </div>
    </form>
  )
}

const SearchClient = () => {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query") || ""
  const currentPage = Number.parseInt(searchParams.get("page") || "1")
  const itemsPerPage = 6

  const [filteredProperties, setFilteredProperties] = useState<
    PropertyCardProps[]
  >([])

  useEffect(() => {
    const filtered = properties.filter((property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredProperties(filtered)
  }, [searchQuery])

  const indexOfLastProperty = currentPage * itemsPerPage
  const indexOfFirstProperty = indexOfLastProperty - itemsPerPage
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty,
  )

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 mt-5">Property Search</h1>

      <SearchBar initialQuery={searchQuery} />

      <div className="mt-8 w-full">
        <h2 className="text-xl font-semibold mb-4">
          {searchQuery
            ? `Search Results for: ${searchQuery}`
            : "All Properties"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {currentProperties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PropertyCard {...property} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-5 mb-5">
          <PaginationWithLinks
            totalCount={filteredProperties.length}
            pageSize={itemsPerPage}
            page={currentPage}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchClient
