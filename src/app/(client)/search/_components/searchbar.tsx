"use client"

// components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, MapPin, Home, Building, Briefcase } from "lucide-react"

// utils
import { motion } from "framer-motion"

// hooks
import { useRouter } from "next-nprogress-bar"
import { useState, useCallback } from "react"

// types
import type { Variants } from "framer-motion"

export type PropertyType = "House" | "Apartment" | "Land" | "Commercial"
export type Filter = {
  types: PropertyType[]
  minPrice: number
  maxPrice: number
}

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

const SearchBar = ({
  initialQuery,
  filters,
  setFilters,
}: {
  initialQuery: string
  filters: Filter
  setFilters: React.Dispatch<React.SetStateAction<Filter>>
}) => {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`)
    }
  }

  const clearQuery = () => {
    setQuery("")
    router.push("/search")
    router.refresh()
  }

  const toggleFilter = useCallback(
    (type: PropertyType) => {
      setFilters((prev) => ({
        ...prev,
        types: prev.types.includes(type)
          ? prev.types.filter((t) => t !== type)
          : [...prev.types, type],
      }))
    },
    [setFilters],
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
        {(["House", "Apartment", "Land", "Commercial"] as PropertyType[]).map(
          (type) => (
            <motion.div
              key={type}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                onClick={() => toggleFilter(type)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  filters.types.includes(type)
                    ? "bg-green-500 text-white dark:hover:bg-green-400"
                    : "bg-gray-200 text-black dark:text-black hover:bg-gray-300 hover:dark:text-black"
                }`}
              >
                {type === "House" && <Home size={14} className="mr-1" />}
                {type === "Apartment" && (
                  <Building size={14} className="mr-1" />
                )}
                {type === "Land" && <MapPin size={14} className="mr-1" />}
                {type === "Commercial" && (
                  <Briefcase size={14} className="mr-1" />
                )}
                {type}
              </Button>
            </motion.div>
          ),
        )}
      </div>
    </motion.div>
  )
}

export default SearchBar
