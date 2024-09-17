import * as React from "react"

import * as RPNInput from "react-phone-number-input"
import flags from "react-phone-number-input/flags"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import type { InputProps } from "@/components/ui/input"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/pop-over"
import { ArrowDownUp, CheckIcon } from "lucide-react"

type InputPhoneProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> & {
  onChange?: (value: RPNInput.Value) => void
}

const InputPhone = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  InputPhoneProps
>(({ className, onChange, ...props }, ref) => (
  <RPNInput.default
    ref={ref}
    className={cn("flex", className)}
    flagComponent={FlagComponent}
    countrySelectComponent={CountrySelect}
    inputComponent={InputComponent}
    onChange={(value) => onChange?.(value as RPNInput.Value)}
    {...props}
  />
))
InputPhone.displayName = "InputPhone"

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      className={cn(
        "rounded-e-lg rounded-s-none dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500",
        className,
      )}
      {...props}
      ref={ref}
    />
  ),
)
InputComponent.displayName = "InputComponent"

interface CountrySelectOption {
  label: string
  value: RPNInput.Country
}

interface CountrySelectProps {
  disabled?: boolean
  value: RPNInput.Country
  onChange: (value: RPNInput.Country) => void
  options: CountrySelectOption[]
}

function CountrySelect({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => onChange(country),
    [onChange],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "flex gap-1 rounded-e-none rounded-s-lg px-3 dark:bg-gray-800 dark:text-white",
          )}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ArrowDownUp
            className={cn("-mr-2 size-4 opacity-50 dark:text-white")}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 dark:bg-gray-900">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search country..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  className="gap-2"
                  key={option.value || "ZZ"}
                  onSelect={() => handleSelect(option.value)}
                >
                  <FlagComponent
                    country={option.value}
                    countryName={option.label}
                  />
                  <span className="flex-1 text-sm dark:text-white">
                    {option.label}
                  </span>
                  {option.value && (
                    <span className="text-foreground/50 text-sm dark:text-gray-400">
                      {`+${RPNInput.getCountryCallingCode(option.value)}`}
                    </span>
                  )}
                  <CheckIcon
                    className={cn(
                      "ml-auto size-4 dark:text-white",
                      option.value === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function FlagComponent({ country, countryName }: RPNInput.FlagProps) {
  const Flag = flags[country]

  return (
    <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm">
      {Flag && <Flag title={countryName} />}
    </span>
  )
}
FlagComponent.displayName = "FlagComponent"

export { InputPhone }
