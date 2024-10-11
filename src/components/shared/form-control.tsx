// components
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import AmountInput from "@/components/shared/amount-input"
import ImageUpload from "@/components/shared/image-upload"
import { InputPhone } from "@/components/ui/input-phone"
import { Switch } from "@/components/ui/switch"

// utils
import { cn } from "@/lib/utils"

// types
import type { FieldValues, UseFormReturn } from "react-hook-form"
import type { FieldConfig, Mutation } from "@/lib/types"

interface FormControlRendererProps<TFieldValues extends FieldValues> {
  field: FieldConfig<TFieldValues>
  formField: any
  form: UseFormReturn<TFieldValues>
  mutation?: Mutation
  disabled: boolean
}

const FormControlRenderer = <TFieldValues extends FieldValues>({
  field,
  formField,
  form,
  mutation,
  disabled,
}: FormControlRendererProps<TFieldValues>) => {
  switch (field.type) {
    case "select":
      return (
        <Select
          onValueChange={formField.onChange}
          defaultValue={formField.value}
          disabled={mutation?.isPending || disabled}
        >
          <SelectTrigger
            className={cn(
              form.formState.errors[field.name]
                ? "border-red-600 focus:ring-0"
                : "",
              field.className,
            )}
          >
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value!}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case "image":
      return (
        <ImageUpload
          value={formField.value.map((image: { url: string }) => image.url)}
          onChange={(urls: string[]) => {
            formField.onChange(urls.map((url: string) => ({ url })))
          }}
          onRemove={(url: string) => {
            formField.onChange(
              formField.value.filter((current: any) => current.url !== url),
            )
          }}
        />
      )

    case "switch":
      if (field.isOnClient) return null
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={formField.value === "admin"}
            onCheckedChange={(checked) => {
              formField.onChange(checked ? "admin" : "client")
            }}
            disabled={mutation?.isPending || disabled}
          />
          <label
            htmlFor={field.name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {formField.value === "admin" ? "Admin" : "Client"}
          </label>
        </div>
      )

    case "phone":
      return (
        <InputPhone
          {...formField}
          id={field.name}
          placeholder={field.placeholder}
          disabled={mutation?.isPending || disabled}
          className={cn(
            form.formState.errors[field.name]
              ? "border-red-600 focus:ring-0"
              : "",
            field.className,
          )}
          onChange={(value) => formField.onChange(value?.toString() || "")}
        />
      )

    case "currency":
      return (
        <AmountInput
          value={formField.value}
          onChange={(value) => formField.onChange(value)}
          placeholder={field.placeholder}
          disabled={mutation?.isPending || disabled}
        />
      )

    case "text":
    case "color":
    case "password":
    case "email":
    case "number":
    case "date":
      return (
        <FloatingLabelInput
          {...formField}
          id={field.name}
          type={field.type}
          label={field.label}
          placeholder={field.placeholder}
          disabled={mutation?.isPending}
          hasErrors={!!form.formState.errors[field.name]}
          className={cn(
            form.formState.errors[field.name]
              ? "border-red-600 focus:ring-0"
              : "",
            field.className,
          )}
          isPassword={field.type === "password"}
        />
      )

    default:
      return null
  }
}

export default FormControlRenderer
