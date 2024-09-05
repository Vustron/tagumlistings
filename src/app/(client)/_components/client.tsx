"use client"

// components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

// hooks
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

// utils
import { AnimatePresence, motion } from "framer-motion"

const Client = () => {
  const [showChatInput, setShowChatInput] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleChatNowClick = () => {
    setShowChatInput(true)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
    }
  }

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  }

  const inputVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  return (
    <section className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 py-24 lg:py-32 sm:px-6">
      <div className="relative mb-4">
        <div className="bg-gradient-to-br from-green-950/[0.8] to-blue-950/[0.7] dark:from-green-500/[0.8] dark:to-green-900/[0.7] border border-green-900 dark:border-green-300 rounded-lg p-1 overflow-hidden">
          <Image
            src="/icons/favicon.ico"
            alt="image"
            width={32}
            height={32}
            className="block mx-auto"
          />
        </div>
      </div>
      <div className="text-center font-bold text-5xl sm:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-black to-gray-900 dark:from-white dark:via-neutral-200 dark:to-black/[0.6]">
        <p className="p-1">TagumListings</p>
      </div>
      <div className="mt-4 text-sm text-center text-black dark:text-white/[0.7] max-w-md mx-auto">
        We offer the most affordable house and lot with good quality and
        services. Beautifully designed homes brought by RME Real Estate
        Brokerage
      </div>
      <div className="mt-5 w-full flex flex-col sm:flex-row justify-center sm:gap-10 gap-4 text-black dark:text-white">
        <AnimatePresence mode="wait">
          {!showChatInput ? (
            <motion.div
              key="button"
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button
                onClick={handleChatNowClick}
                className="h-10 sm:h-8 w-full sm:w-36 bg-gradient-to-br from-green-950 to-blue-950 dark:from-green-500 dark:to-green-900 border border-green-900 dark:border-green-300 rounded-lg flex items-center justify-center gap-1.5"
              >
                <span className="text-sm">Search property</span>
                <motion.span
                  className="inline-block"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 10,
                  }}
                >
                  &rarr;
                </motion.span>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial="initial"
              animate="animate"
              variants={inputVariants}
              className="w-full max-w-md"
            >
              <form onSubmit={handleSearch} className="w-full">
                <Input
                  type="text"
                  placeholder="Search property name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 text-black dark:text-white bg-white dark:bg-gradient-to-br from-green-950 to-blue-950 border border-green-900 dark:border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  autoFocus
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Client
