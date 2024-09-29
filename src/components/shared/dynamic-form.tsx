// components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import SubmitButton from "@/components/shared/submit-button"
import ImageUpload from "@/components/shared/image-upload"
import { InputPhone } from "@/components/ui/input-phone"
import { Switch } from "@/components/ui/switch"

// utils
import { cn } from "@/lib/utils"

// types
import type { DynamicFormProps } from "@/lib/types"
import type { FieldValues } from "react-hook-form"
import AmountInput from "./amount-input"

const DynamicForm = <TFieldValues extends FieldValues>({
  form,
  onSubmit,
  fields,
  submitButtonTitle,
  mutation,
  className,
  disabled,
  submitButtonClassname,
  submitButtonTitleClassname,
}: DynamicFormProps<TFieldValues>) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("w-full space-y-5", className)}
      >
        {fields.map((field) => (
          <FormField
            key={field.name}
            name={field.name}
            control={form.control}
            render={({ field: formField }) => (
              <FormItem>
                <FormControl>
                  {field.type === "select" ? (
                    <Select
                      onValueChange={formField.onChange}
                      defaultValue={formField.value}
                      disabled={mutation?.isPending || disabled}
                    >
                      <SelectTrigger
                        className={cn(
                          form.formState.errors[field.name]
                            ? "border-red-600 focus:ring-0 text-red-500"
                            : "text-black dark:text-white",
                          field.className,
                        )}
                      >
                        <SelectValue
                          className="text-black dark:text-white"
                          placeholder={field.placeholder}
                        />
                      </SelectTrigger>
                      <SelectContent className="text-black dark:text-white">
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "image" ? (
                    <ImageUpload
                      value={formField.value.map(
                        (image: { url: string }) => image.url,
                      )}
                      onChange={(urls: string[]) => {
                        formField.onChange(urls.map((url: string) => ({ url })))
                      }}
                      onRemove={(url: string) => {
                        formField.onChange(
                          formField.value.filter(
                            (current: any) => current.url !== url,
                          ),
                        )
                      }}
                    />
                  ) : field.type === "switch" ? (
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
                  ) : field.isPhone ? (
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
                      onChange={(value) =>
                        formField.onChange(value?.toString() || "")
                      }
                    />
                  ) : field.type === "currency" ? (
                    <AmountInput
                      value={formField.value}
                      onChange={(value) => formField.onChange(value)}
                      placeholder={field.placeholder}
                      disabled={mutation?.isPending || disabled}
                    />
                  ) : (
                    <FloatingLabelInput
                      {...formField}
                      id={field.name}
                      type={field.type}
                      label={field.label}
                      placeholder={field.placeholder}
                      disabled={mutation?.isPending || disabled}
                      hasErrors={!!form.formState.errors[field.name]}
                      className={cn(
                        form.formState.errors[field.name]
                          ? "border-red-600 focus:ring-0"
                          : "",
                        field.className,
                      )}
                      isPassword={field.type === "password"}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <SubmitButton
          type="submit"
          title={submitButtonTitle}
          disabled={mutation?.isPending || disabled}
          buttonClassName={cn(
            "w-full focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-600 dark:hover:text-black",
            submitButtonClassname,
          )}
          titleClassName={submitButtonTitleClassname}
        />
      </form>
    </Form>
  )
}

export default DynamicForm
