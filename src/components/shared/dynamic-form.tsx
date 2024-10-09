// components
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import FormControlRenderer from "@/components/shared/form-control"
import DynamicButton from "@/components/shared/dynamic-button"

// utils
import { cn } from "@/lib/utils"

// types
import type { DynamicFormProps } from "@/lib/types"
import type { FieldValues } from "react-hook-form"
import Link from "next/link"

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
  isSignIn,
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
                  <FormControlRenderer
                    field={field}
                    formField={formField}
                    form={form}
                    mutation={mutation}
                    disabled={disabled!}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* forgot password */}
        {isSignIn && (
          <DynamicButton variant="link" size="sm" asChild buttonClassName="">
            <Link href="/forgot-password">
              <span className="text-sm text-muted-foreground">
                Forgot password?
              </span>
            </Link>
          </DynamicButton>
        )}

        <DynamicButton
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
