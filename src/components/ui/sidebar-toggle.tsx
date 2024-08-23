// components
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

// utils
import { cn } from "@/lib/utils"

interface SidebarToggleProps {
  isOpen: boolean | undefined
  setIsOpen?: () => void
}

const SidebarToggle = ({ isOpen, setIsOpen }: SidebarToggleProps) => {
  return (
    <div className="invisible lg:visible absolute top-[12px] -right-[16px] z-20">
      <Button
        onClick={() => setIsOpen?.()}
        className="rounded-md size-8"
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "size-4 transition-transform ease-in-out duration-300",
            isOpen === false ? "rotate-180" : "rotate-0",
          )}
        />
      </Button>
    </div>
  )
}

export default SidebarToggle
