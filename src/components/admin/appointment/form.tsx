"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// utils
import { updateAppointmentFields } from "@/lib/misc/field-configs"
import { updateAppointmentSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"

// hooks
import { useUpdateAppointment } from "@/lib/hooks/appointment/update"
import { useForm } from "react-hook-form"

// types
import type { UserData, Appointment, AppointmentDate } from "@/lib/types"
import type { UpdateAppointmentValues } from "@/lib/validation"

interface UpdateAppointmentFormProps {
  accounts: UserData[]
  appointment: Appointment
  appointmentDates: AppointmentDate[]
}

const UpdateAppointmentForm = ({
  accounts,
  appointment,
  appointmentDates,
}: UpdateAppointmentFormProps) => {
  const updateAppointment = useUpdateAppointment(appointment.id)

  const form = useForm<UpdateAppointmentValues>({
    resolver: zodResolver(updateAppointmentSchema),
    defaultValues: {
      id: appointment.id,
      user: appointment.user,
      date: new Date(appointment.date).toISOString(),
      description: appointment.description,
      color: appointment.color,
      status: appointment.status,
      propertyId: appointment.propertyId,
    },
  })

  // submit handler
  const submitHandler = async (values: UpdateAppointmentValues) => {
    await toast.promise(updateAppointment.mutateAsync(values), {
      loading: <span className="animate-pulse">Updating appointment...</span>,
      success: "Appointment updated",
      error: (error: unknown) => clientErrorHandler(error),
    })

    form.reset()
  }

  return (
    <DynamicForm<UpdateAppointmentValues>
      form={form}
      onSubmit={submitHandler}
      fields={updateAppointmentFields(accounts, appointmentDates)}
      submitButtonTitle="Update Appointment"
      submitButtonClassname="bg-green-500 rounded-3xl hover:dark:text-black"
      submitButtonTitleClassname="text-md font-medium"
      mutation={updateAppointment}
    />
  )
}

export default UpdateAppointmentForm
