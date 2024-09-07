"use client"

// components
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// hooks
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

// utils
import { AnimatePresence, motion } from "framer-motion"
import { Search } from "lucide-react"

interface SearchButtonProps {
  placeholder?: string
}

const SearchButton = ({ placeholder = "Search..." }: SearchButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
    if (isExpanded && searchQuery.trim() !== "") {
      handleSearch()
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setIsExpanded(false)
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
        <AnimatePresence>
          {isExpanded && (
            <motion.input
              key="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1 bg-transparent text-black dark:text-white outline-none border border-zinc-300 dark:border-zinc-700 rounded-md transition-opacity duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              placeholder={placeholder}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            onClick={handleToggle}
            variant="outline"
            size="icon"
            className="flex items-center justify-center rounded-full size-8 bg-background z-10"
            aria-label="Search"
          >
            <Search className="w-[1.2rem] h-[1.2rem]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isExpanded ? "Search" : "Open Search"}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export default SearchButton
