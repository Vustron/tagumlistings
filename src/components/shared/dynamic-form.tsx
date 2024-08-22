// components
import SubmitButton from "@/components/shared/submit-button"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

// utils
import { cn } from "@/lib/utils"

// types
import type { DynamicFormProps } from "@/lib/types"
import type { FieldValues } from "react-hook-form"

const DynamicForm = <TFieldValues extends FieldValues>({
  form,
  onSubmit,
  fields,
  submitButtonTitle,
  mutation,
  className,
  disabled,
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
          buttonClassName="w-full focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-600"
        />
      </form>
    </Form>
  )
}

export default DynamicForm
