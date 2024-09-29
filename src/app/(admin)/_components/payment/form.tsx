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
import { useUpdatePayment } from "@/app/(admin)/_hooks/payment/update"
import { useForm } from "react-hook-form"

// types
import type { Appointment } from "@/app/(admin)/_components/appointments/new"
import type { Property } from "@/app/(admin)/_components/data/properties"
import type { Payment } from "@/app/(admin)/_components/data/payments"
import type { UpdatePaymentValues } from "@/lib/validation"
import type { UserData } from "@/lib/types"

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
      appointment: payment.appointment,
      amount: payment.amount,
      paid_date: payment.paid_date,
    },
  })

  // submit handler
  const submitHandler = async (values: UpdatePaymentValues) => {
    console.log(values)
    await toast.promise(updatePayment.mutateAsync(values), {
      loading: <span className="animate-pulse">Updating payment...</span>,
      success: "Payment updated",
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
