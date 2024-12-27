"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// utils
import { updatePaymentFields } from "@/lib/misc/field-configs"
import { zodResolver } from "@hookform/resolvers/zod"
import { updatePaymentSchema } from "@/lib/validation"
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"

// hooks
import { useUpdatePayment } from "@/lib/hooks/payments/update"
import { useForm } from "react-hook-form"

// types
import type { UserData, Appointment, Payment, Property } from "@/lib/types"
import type { UpdatePaymentValues } from "@/lib/validation"

interface AddPaymentFormProps {
  accounts: UserData[]
  appointments: Appointment[]
  properties: Property[]
  payment: Payment
}

const UpdatePaymentForm = ({
  accounts,
  appointments,
  properties,
  payment,
}: AddPaymentFormProps) => {
  const updatePayment = useUpdatePayment(payment?.id)

  const form = useForm<UpdatePaymentValues>({
    resolver: zodResolver(updatePaymentSchema),
    defaultValues: {
      id: payment.id,
      property: payment.property,
      user: payment.user,
      agent: payment?.agent!,
      appointment: payment.appointment,
      amount: payment.amount,
      paid_date: payment.paid_date,
      status: payment.status,
    },
  })

  // submit handler
  const submitHandler = async (values: UpdatePaymentValues) => {
    await toast.promise(updatePayment.mutateAsync(values), {
      loading: <span className="animate-pulse">Updating record...</span>,
      success: "Record updated",
      error: (error: unknown) => clientErrorHandler(error),
    })

    form.reset()
  }

  return (
    <DynamicForm<UpdatePaymentValues>
      form={form}
      onSubmit={submitHandler}
      fields={updatePaymentFields(accounts, appointments, properties)}
      submitButtonTitle="Save changes"
      submitButtonClassname="bg-green-500 rounded-3xl hover:dark:text-black"
      submitButtonTitleClassname="text-md font-medium"
      mutation={updatePayment}
    />
  )
}

export default UpdatePaymentForm
