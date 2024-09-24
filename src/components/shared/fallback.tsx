import { Loader2, ServerCrash } from "lucide-react"

export const LoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className="size-10 animate-spin" />
    </div>
  )
}

export const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <ServerCrash className="size-7 text-zinc-500 my-4" />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Something went wrong: {error.message}
      </p>
    </div>
  )
}
