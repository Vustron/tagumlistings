// components
import MediaImage from "@/components/shared/media-image"
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
import { IKUpload } from "imagekitio-next"
import { Loader2, Upload, X } from "lucide-react"

// hooks
import { useRef, useState } from "react"

// utils
import { cn } from "@/lib/utils"

// types
import type { DynamicFormProps } from "@/lib/types"
import type { FieldValues } from "react-hook-form"
import toast from "react-hot-toast"

// TODO: 🪲 dli mugawas ang loader pag upload dafq
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
  const [isUploading, setIsUploading] = useState(false)
  const uploadRef = useRef<HTMLInputElement>(null)

  const handleSuccess = (result: any, field: any) => {
    setIsUploading(false)
    if (result?.url) {
      const currentImages = (form.getValues(field.name) as string[]) || []
      form.setValue(field.name, [...currentImages, result.url] as any)
      toast.success("Image Uploaded.")
      setIsUploading(false)
    }
  }

  const handleError = (error: any) => {
    setIsUploading(false)
    toast.error(`Upload Error: ${error}`)
  }

  const handleProgress = (event: any) => {
    console.log("Upload Progress", event)
    setIsUploading(true)
  }

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
                      <div className="flex flex-col gap-2">
                        <IKUpload
                          multiple={true}
                          useUniqueFileName
                          onError={handleError}
                          onProgress={handleProgress}
                          onSuccess={(result: any) =>
                            handleSuccess(result, field)
                          }
                          ref={uploadRef}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          onClick={() => uploadRef.current?.click()}
                          className="dark:text-white bg-green-600 hover:bg-green-500 rounded-xl p-2"
                        >
                          {isUploading ? (
                            <Loader2 className="animate-spin size-5" />
                          ) : (
                            <>
                              <Upload className="mr-2 size-5" />
                              Upload Images
                            </>
                          )}
                        </Button>
                        {Array.isArray(formField.value) &&
                          formField.value.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {formField.value.map(
                                (imageUrl: string, index: number) => (
                                  <div key={index} className="relative">
                                    <MediaImage
                                      src={imageUrl}
                                      alt={`Uploaded ${index + 1}`}
                                      className="size-32 rounded-md"
                                      width={400}
                                      height={400}
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
