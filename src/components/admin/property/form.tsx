"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// utils
import { updatePropertyFields } from "@/lib/misc/field-configs"
import { updatePropertySchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"

// hooks
import { useUpdateProperty } from "@/lib/hooks/property/update"
import { useForm } from "react-hook-form"

// types
import type { UpdatePropertyValues } from "@/lib/validation"
import type { Property, Accounts } from "@/lib/types"

interface UpdatePropertyFormProps {
  data: Property
  accounts: Accounts
}

const UpdatePropertyForm = ({ data, accounts }: UpdatePropertyFormProps) => {
  const updateProperty = useUpdateProperty(data?.id)
  const accountsList = accounts?.accounts || []

  const form = useForm<UpdatePropertyValues>({
    resolver: zodResolver(updatePropertySchema),
    defaultValues: {
      id: data.id,
      category: data.category,
      location: data.location,
      status: data.status,
      propertyPics: data.propertyPics,
      price: data.price,
      no_of_bedrooms: data.no_of_bedrooms,
      no_of_bathrooms: data.no_of_bathrooms,
      square_meter: data.square_meter,
      user: data.user ?? "N/A",
      agent: data.user ?? "N/A",
    },
  })

  // submit handler
  const submitHandler = async (values: UpdatePropertyValues) => {
    console.log(values)
    await toast.promise(updateProperty.mutateAsync(values), {
      loading: <span className="animate-pulse">Updating property...</span>,
      success: "Property updated",
      error: (error: unknown) => clientErrorHandler(error),
    })
    form.reset()
  }

  return (
    <DynamicForm<UpdatePropertyValues>
      form={form}
      onSubmit={submitHandler}
      fields={updatePropertyFields(accountsList)}
      submitButtonTitle="Save changes"
      submitButtonClassname="bg-green-500 rounded-3xl hover:dark:text-black"
      submitButtonTitleClassname="text-md font-medium"
      mutation={updateProperty}
    />
  )
}

export default UpdatePropertyForm
