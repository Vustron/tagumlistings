"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// utils
import { addPaymentFields } from "@/lib/misc/field-configs"
import { zodResolver } from "@hookform/resolvers/zod"
import { addPaymentSchema } from "@/lib/validation"
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"

// hooks
import { useCreatePayment } from "@/lib/hooks/payment/create"
import { useForm } from "react-hook-form"

// types
import type { UserData, Property, Appointment } from "@/lib/types"
import type { AddPaymentValues } from "@/lib/validation"

interface AddPaymentFormProps {
  accounts: UserData[]
  appointments: Appointment[]
  properties: Property[]
  property?: string
  price?: string
}

const NewPaymentForm = ({
  accounts,
  appointments,
  properties,
  property,
  price,
}: AddPaymentFormProps) => {
  const addPayment = useCreatePayment()

  const form = useForm<AddPaymentValues>({
    resolver: zodResolver(addPaymentSchema),
    defaultValues: {
      property: property || (properties.length > 0 ? properties[0]?.id : ""),
      user: accounts.length > 0 ? accounts[0]?.id : "",
      appointment: appointments.length > 0 ? appointments[0]?.id : "",
      amount: price || "",
      paid_date: "",
    },
  })

  // submit handler
  const submitHandler = async (values: AddPaymentValues) => {
    await toast.promise(addPayment.mutateAsync(values), {
      loading: <span className="animate-pulse">Creating payment...</span>,
      success: "Payment created",
      error: (error: unknown) => clientErrorHandler(error),
    })

    form.reset()
  }

  const fields = addPaymentFields(
    accounts,
    appointments,
    properties,
    property,
  ).filter((field) => !(property && field.name === "property"))

  return (
    <DynamicForm<AddPaymentValues>
      form={form}
      onSubmit={submitHandler}
      fields={fields}
      submitButtonTitle="Create Payment"
      submitButtonClassname="bg-green-500 rounded-3xl hover:dark:text-black"
      submitButtonTitleClassname="text-md font-medium"
      mutation={addPayment}
    />
  )
}

export default NewPaymentForm
