"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// utils
import { addAppointmentFields } from "@/lib/misc/field-configs"
import { addAppointmentSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"

// hooks
import { useCreateAppointment } from "@/lib/hooks/appointment/create"
import { useForm } from "react-hook-form"

// types
import type { AddAppointmentValues } from "@/lib/validation"
import type { UserData, AppointmentDate } from "@/lib/types"

interface NewAppointmentFormProps {
  accounts: UserData[]
  appointmentDates: AppointmentDate[]
}

const NewAppointmentForm = ({
  accounts,
  appointmentDates,
}: NewAppointmentFormProps) => {
  const createAppointment = useCreateAppointment()

  const form = useForm<AddAppointmentValues>({
    resolver: zodResolver(addAppointmentSchema),
    defaultValues: {
      user: "",
      date: "",
      description: "",
      color: "",
    },
  })

  // submit handler
  const submitHandler = async (values: AddAppointmentValues) => {
    await toast.promise(createAppointment.mutateAsync(values), {
      loading: <span className="animate-pulse">Adding appointment...</span>,
      success: "Appointment added",
      error: (error: unknown) => clientErrorHandler(error),
    })

    form.reset()
  }

  return (
    <DynamicForm<AddAppointmentValues>
      form={form}
      onSubmit={submitHandler}
      fields={addAppointmentFields(accounts, appointmentDates)}
      submitButtonTitle="Add Appointment"
      submitButtonClassname="bg-green-500 rounded-3xl hover:dark:text-black"
      submitButtonTitleClassname="text-md font-medium"
      mutation={createAppointment}
    />
  )
}

export default NewAppointmentForm
