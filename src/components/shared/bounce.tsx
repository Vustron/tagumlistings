"use client"

// utils
import { motion } from "framer-motion"

interface BounceWrapper extends React.PropsWithChildren {
  children: React.ReactNode
  className?: string
}

const BounceWrapper = ({ children, className = "" }: BounceWrapper) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
      }}
    >
      {children}
    </motion.div>
  )
}

export default BounceWrapper
