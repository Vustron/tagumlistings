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
}

const NewPaymentForm = ({
  accounts,
  appointments,
  properties,
}: AddPaymentFormProps) => {
  const addPayment = useCreatePayment()

  const form = useForm<AddPaymentValues>({
    resolver: zodResolver(addPaymentSchema),
    defaultValues: {
      property: properties.length > 0 ? properties[0]?.id : "",
      user: accounts.length > 0 ? accounts[0]?.id : "",
      appointment: appointments.length > 0 ? appointments[0]?.id : "",
      amount: "",
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

  return (
    <DynamicForm<AddPaymentValues>
      form={form}
      onSubmit={submitHandler}
      fields={addPaymentFields(accounts, appointments, properties)}
      submitButtonTitle="Create Payment"
      submitButtonClassname="bg-green-500 rounded-3xl hover:dark:text-black"
      submitButtonTitleClassname="text-md font-medium"
      mutation={addPayment}
    />
  )
}

export default NewPaymentForm
