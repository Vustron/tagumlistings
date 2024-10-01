"use client"

// components
import { Loader2, ServerCrash } from "lucide-react"

export const LoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[500px]">
      <Loader2 className="size-20 animate-spin" />
    </div>
  )
}

export const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <ServerCrash className="size-7 text-zinc-500 my-4" />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Something went wrong:{"\n"}
        <span className="text-red-600">{error.message}</span>
      </p>
    </div>
  )
}
