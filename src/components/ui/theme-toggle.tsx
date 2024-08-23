"use client"

// components
import { Button } from "@/components/ui/button"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Moon, Sun } from "lucide-react"

// utils
import { useTheme } from "next-themes"
import * as React from "react"

export default function ThemeToggle() {
  // theme state
  const { setTheme, theme } = useTheme()

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Button
          className="rounded-full size-8 bg-background"
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Moon className="w-[1.2rem] h-[1.2rem] rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />

          <Sun className="absolute w-[1.2rem] h-[1.2rem] rotate-0 scale-1000 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0" />
          <span className="sr-only">Switch Theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Switch Theme</TooltipContent>
    </Tooltip>
  )
}
