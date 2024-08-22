// components
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="m-auto flex size-full flex-col items-center justify-center">
      <Loader2 className="size-20 animate-spin" />
    </div>
  )
}
