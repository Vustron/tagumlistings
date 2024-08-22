"use client"

// components
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// utils
import { cn } from "@/lib/utils/"

interface Props {
  children?: React.ReactNode
  asChild?: boolean
  size?: "default" | "sm" | "lg" | "icon" | null | undefined
  disabled?: boolean
  onClick?: () => void
  buttonClassName?: string
  title?: string
  icon?: React.ReactNode
  position?: string
  type?: "button" | "submit" | "reset" | undefined
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "expandIcon"
    | "ringHover"
    | "shine"
    | "gooeyRight"
    | "gooeyLeft"
    | "linkHover1"
    | "linkHover2"
    | null
    | undefined
  titleClassName?: string
}

const SubmitButton = ({
  children,
  asChild,
  size,
  disabled,
  onClick,
  buttonClassName,
  title,
  type,
  icon,
  position,
  variant,
  titleClassName,
}: Props) => {
  const content = (
    <>
      {!disabled && position === "left" && icon}

      <span
        className={cn(`${titleClassName}`, disabled ? "animate-pulse" : "")}
      >
        {disabled && <Loader2 className="size-4 animate-spin" />}
        {!disabled && title}
      </span>
      {!disabled && position === "right" && icon}
    </>
  )

  if (asChild) {
    return (
      <Button
        asChild={asChild}
        size={size}
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={cn(`${buttonClassName}`)}
        variant={variant}
      >
        {children}
      </Button>
    )
  }

  return (
    <Button
      size={size}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={cn(`${buttonClassName}`)}
      variant={variant}
    >
      {content}
    </Button>
  )
}

export default SubmitButton
