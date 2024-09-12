"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// configs
import { env } from "@/lib/config/env.mjs"

// utils
import { addPropertyFields } from "@/lib/misc/field-configs"
import { clientErrorHandler } from "@/lib/utils"
import { addPropertySchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"

// hooks
// import { useNewProperty } from "@/app/(admin)/properties/new/api"
import { useForm } from "react-hook-form"

// types
import type { AddPropertyValues } from "@/lib/validation"

// TODO: 🛠️ work in progress newProperty mutation and ui as well

const NewPropertyForm = () => {
  // init mutation
  // const newProperty = useNewProperty()

  // init form
  const form = useForm<AddPropertyValues>({
    resolver: zodResolver(addPropertySchema),
    defaultValues: {
      category: "",
      location: "",
      status: "",
      propertyPics: [],
    },
  })

  // submit handler
  const submitHandler = async (values: AddPropertyValues) => {
    // await toast.promise(newProperty.mutateAsync(values), {
    //   loading: <span className="animate-pulse">Adding property...</span>,
    //   success: "Property added",
    //   error: (error: unknown) => clientErrorHandler(error),
    // })
    console.log(values)
    form.reset()
  }

  return (
    <DynamicForm<AddPropertyValues>
      form={form}
      onSubmit={submitHandler}
      fields={addPropertyFields}
      submitButtonTitle="Add"
      submitButtonClassname="bg-green-500 rounded-3xl hover:dark:text-black"
      submitButtonTitleClassname="text-md font-medium"

      // mutation={() => {}}
    />
  )
}

export default NewPropertyForm
