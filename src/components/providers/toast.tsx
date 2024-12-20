"use client"

import { CircleAlert, CircleCheckBig, Loader2 } from "lucide-react"

import { Toaster, resolveValue } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

// types
import type { ToastType, Toast } from "react-hot-toast"
import type { FC, JSX } from "react"

// Define the colors for each toast type
const colors: Record<ToastType, string> = {
  success: "#16A34A",
  error: "#DC2626",
  loading: "#fbbf24",
  blank: "#A3A3A3",
  custom: "#094CC9",
}

// Get the primary color based on the toast type
const getColor = (type: ToastType): string => colors[type] || colors.error

// Get the background color with transparency
const getBackgroundColor = (type: ToastType): string => `${getColor(type)}20`

// Icon mapping based on toast type
const getIcon = (type: ToastType): JSX.Element => {
  switch (type) {
    case "loading":
      return <Loader2 className="size-6 animate-spin text-yellow-600" />
    case "success":
      return <CircleCheckBig className="size-6 text-green-600" />
    case "error":
      return <CircleAlert className="size-6 text-red-600" />
    default:
      return <CircleAlert className="size-6 text-blue-600" />
  }
}

const ToastProvider: FC = () => {
  return (
    <Toaster position="top-center">
      {(t: Toast) => (
        <AnimatePresence>
          {t.visible && (
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center max-w-full dark:bg-black bg-white border-2 rounded-lg shadow-md p-2"
              style={{
                color: getColor(t.type),
                borderColor: getBackgroundColor(t.type),
              }}
            >
              <div
                className="flex items-center justify-center w-2 h-full mr-2"
                style={{ background: getColor(t.type) }}
              />
              <div className="flex items-center justify-center size-8 mr-2">
                {getIcon(t.type)}
              </div>
              <div className="flex-1 text-sm mr-4">
                {resolveValue(t.message, t)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Toaster>
  )
}

export default ToastProvider
