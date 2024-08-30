"use client"

// components
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// hooks
import { useState } from "react"

// utils
import { motion } from "framer-motion"
import { Search } from "lucide-react"

interface SearchButtonProps {
  placeholder?: string
  onSearch: (query: string) => void
}

const SearchButton = ({
  placeholder = "Search...",
  onSearch,
}: SearchButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      onSearch(searchQuery)
      setSearchQuery("") // Clear input after search
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <motion.div
        className="relative flex items-center"
        initial={false}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={{
          collapsed: { width: "2.5rem" },
          expanded: { width: "12rem" },
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Search input */}
        <motion.input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-1 bg-transparent text-black dark:text-white outline-none border border-zinc-300 dark:border-zinc-700 rounded-md transition-opacity duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          exit={{ opacity: 0 }}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </motion.div>

      {/* Search button */}
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            onClick={handleToggle}
            variant="outline"
            size="icon"
            className="flex items-center justify-center rounded-full size-8 bg-background"
            aria-label="Search"
          >
            <Search className="w-[1.2rem] h-[1.2rem]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Search Property</TooltipContent>
      </Tooltip>
    </div>
  )
}

export default SearchButton
