import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"

// types
import type { FieldError } from "react-hook-form"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isPassword?: boolean
  hasErrors?: FieldError | undefined | boolean
}

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, placeholder, type, isPassword, disabled, hasErrors, ...props },
    ref,
  ) => {
    // init state
    const [showPassword, setShowPassword] = useState<boolean>(false)

    return (
      <>
        <Input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "peer",
            hasErrors
              ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              : "",
            className,
            isPassword ? "hide-password-toggle pr-10" : "",
          )}
          ref={ref}
          {...props}
        />

        {isPassword && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={disabled}
            >
              {showPassword && !disabled ? (
                <EyeIcon className="size-4" aria-hidden="true" />
              ) : (
                <EyeOffIcon className="size-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>

            <style>{`
              .hide-password-toggle::-ms-reveal,
              .hide-password-toggle::-ms-clear {
                visibility: hidden;
                pointer-events: none;
                display: none;
              }
            `}</style>
          </>
        )}
      </>
    )
  },
)
FloatingInput.displayName = "FloatingInput"

const FloatingLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label> & { hasErrors?: boolean }
>(({ className, hasErrors, ...props }, ref) => {
  return (
    <Label
      className={cn(
        "peer-focus:secondary peer-focus:dark:secondary absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
        className,
        hasErrors ? "text-red-600" : "",
      )}
      ref={ref}
      {...props}
    />
  )
})
FloatingLabel.displayName = "FloatingLabel"

type FloatingLabelInputProps = InputProps & {
  label?: string
}

const FloatingLabelInput = React.forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, disabled, hasErrors, isPassword, ...props }, ref) => {
  return (
    <div className="relative">
      <FloatingInput
        ref={ref}
        id={id}
        disabled={disabled}
        hasErrors={hasErrors}
        isPassword={isPassword}
        {...props}
      />
      <FloatingLabel htmlFor={id} hasErrors={!!hasErrors}>
        {label}
      </FloatingLabel>
    </div>
  )
})
FloatingLabelInput.displayName = "FloatingLabelInput"

export { FloatingInput, FloatingLabel, FloatingLabelInput }
