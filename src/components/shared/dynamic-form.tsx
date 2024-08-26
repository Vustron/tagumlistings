// components
import SubmitButton from "@/components/shared/submit-button"
import { Button } from "@/components/ui/button"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
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
import { X } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"

// utils
import { cn } from "@/lib/utils"

// types
import type { DynamicFormProps } from "@/lib/types"
import type { FieldValues } from "react-hook-form"

declare global {
  interface Window {
    cloudinary: any
  }
}

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
  cloudinaryUploadPreset,
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
                            ? "border-red-600 focus:ring-0"
                            : "",
                          field.className,
                        )}
                      >
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "image" ? (
                    <div>
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        {field.label}
                      </label>
                      <CldUploadWidget
                        uploadPreset={cloudinaryUploadPreset}
                        onSuccess={(result: any) => {
                          if (result.info?.secure_url) {
                            const currentImages =
                              (form.getValues(field.name) as string[]) || []
                            form.setValue(field.name, [
                              ...currentImages,
                              result.info.secure_url,
                            ] as any)
                          }
                        }}
                      >
                        {({ open }) => (
                          <Button
                            type="button"
                            onClick={() => open()}
                            className="dark:text-white bg-green-600 hover:bg-green-400 rounded-xl"
                          >
                            Upload Image
                          </Button>
                        )}
                      </CldUploadWidget>
                      {Array.isArray(formField.value) &&
                        formField.value.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {formField.value.map(
                              (imageUrl: string, index: number) => (
                                <div key={index} className="relative">
                                  <img
                                    src={imageUrl}
                                    alt={`Uploaded ${index + 1}`}
                                    className="size-32 object-cover rounded-md"
                                  />
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      const newImages = [
                                        ...formField.value,
                                      ] as string[]
                                      newImages.splice(index, 1)
                                      form.setValue(
                                        field.name,
                                        newImages as any,
                                      )
                                    }}
                                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-md p-1"
                                  >
                                    <X className="size-4" />
                                  </Button>
                                </div>
                              ),
                            )}
                          </div>
                        )}
                    </div>
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
            "w-full focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-600",
            submitButtonClassname,
          )}
          titleClassName={submitButtonTitleClassname}
        />
      </form>
    </Form>
  )
}

export default DynamicForm
