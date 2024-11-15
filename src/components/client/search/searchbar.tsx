"use client"

// components
import { Search, X, MapPin, Home, Building, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// utils
import { motion } from "framer-motion"

// hooks
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useCallback } from "react"

// types
import type { Filter } from "@/lib/types"
import type { Variants } from "framer-motion"

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "residential":
      return <Home size={14} className="mr-1" />
    case "apartment":
      return <Building size={14} className="mr-1" />
    case "land":
      return <MapPin size={14} className="mr-1" />
    case "commercial":
      return <Briefcase size={14} className="mr-1" />
    default:
      return null
  }
}

const SearchBar = ({
  initialQuery,
  filters,
  // @ts-ignore
  setFilters,
  onFilterChange,
  onClearFilters,
  categories,
}: {
  initialQuery: string
  filters: Filter
  setFilters: React.Dispatch<React.SetStateAction<Filter>>
  onFilterChange: (filterType: keyof Filter, value: any) => void
  onClearFilters: () => void
  categories: string[]
}) => {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set("query", query)
    } else {
      params.delete("query")
    }
    router.push(`/search?${params.toString()}`)
  }

  const clearQuery = () => {
    setQuery("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("query")
    router.push(`/search?${params.toString()}`)
  }

  const toggleFilter = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (filters.category === category) {
        params.delete("category")
        onFilterChange("category", "")
      } else {
        params.set("category", category)
        onFilterChange("category", category)
      }
      router.push(`/search?${params.toString()}`)
    },
    [filters.category, onFilterChange, router, searchParams],
  )

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeInUp}
      className="w-full max-w-3xl mb-8"
    >
      <form onSubmit={handleSubmit} className="relative mb-4">
        <div className="flex items-center">
          <motion.div
            className="relative flex-grow"
            whileFocus={{ scale: 1.02 }}
          >
            <Input
              type="text"
              placeholder="Search properties..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-black dark:text-white bg-white dark:bg-gradient-to-br from-green-950 to-blue-950 border border-green-900 dark:border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {query && (
              <Button
                type="button"
                onClick={clearQuery}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 bg-transparent hover:bg-transparent"
              >
                <X size={16} />
              </Button>
            )}
          </motion.div>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              type="submit"
              className="ml-2 bg-green-500 hover:bg-green-600 text-white"
            >
              <Search className="mr-2" size={18} />
              Search
            </Button>
          </motion.div>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <motion.div
            key={category}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={() => toggleFilter(category)}
              className={`px-3 py-1 rounded-lg text-sm ${
                filters.category === category
                  ? "bg-green-500 text-white dark:hover:bg-green-400"
                  : "bg-gray-200 text-black dark:text-black hover:bg-gray-300 hover:dark:text-black"
              }`}
            >
              {getCategoryIcon(category)}
              {category}
            </Button>
          </motion.div>
        ))}
      </div>

      <Button
        onClick={onClearFilters}
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        Clear Filters
      </Button>
    </motion.div>
  )
}

export default SearchBar
