"use client"

// utils
import { AppProgressBar as ProgressBar } from "next-nprogress-bar"

export default function ProgressBarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ProgressBar
        height="4px"
        color="#1f1f1f"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </>
  )
}
