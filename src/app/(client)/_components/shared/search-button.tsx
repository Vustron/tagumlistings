"use client"

// components
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Search } from "lucide-react"

// hooks
import { useAnimation } from "framer-motion"
import { useRouter } from "next-nprogress-bar"
import { useState, useRef, useEffect } from "react"

// utils
import { AnimatePresence, motion } from "framer-motion"

interface SearchButtonProps {
  placeholder?: string
}

const SearchButton = ({ placeholder = "Search..." }: SearchButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    } else if (e.key === "Escape") {
      setIsExpanded(false)
    }
  }

  useEffect(() => {
    controls.start(isExpanded ? "expanded" : "collapsed")
  }, [isExpanded, controls])

  return (
    <div className="flex items-center space-x-2">
      <motion.div
        className="relative flex items-center"
        initial={false}
        animate={controls}
        variants={{
          collapsed: {
            width: "2.5rem",
            transition: { duration: 0.3, ease: "easeInOut" },
          },
          expanded: {
            width: "12rem",
            transition: { duration: 0.3, ease: "easeInOut" },
          },
        }}
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="search-input-container"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-1 bg-transparent text-black dark:text-white outline-none border border-zinc-300 dark:border-zinc-700 rounded-md transition-all duration-300 focus:ring-2 focus:ring-primary"
                placeholder={placeholder}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleToggle}
              variant="outline"
              size="icon"
              className="flex items-center justify-center rounded-full size-8 bg-background z-10 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground dark:hover:text-black"
              aria-label={isExpanded ? "Search" : "Open Search"}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Search className="w-[1.2rem] h-[1.2rem]" />
              </motion.div>
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isExpanded ? "Search" : "Open Search"}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export default SearchButton
