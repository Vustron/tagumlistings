"use client"

// utils
import { createContext } from "react"

// hooks
import { useContext } from "react"

// types
import type { SessionData } from "@/lib/config/session"

const SessionContext = createContext<SessionData | null>(null)

const SessionProvider = ({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionData }>) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export default SessionProvider

export function useSession() {
  // init context
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }

  return context
}
