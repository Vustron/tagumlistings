"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// hooks
import { useSendResetPasswordLink } from "@/lib/hooks/auth/reset-link"
import { useForm } from "react-hook-form"

// utils
import { forgotPasswordFields } from "@/lib/misc/field-configs"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"

// validation
import { resetPasswordEmailSchema } from "@/lib/validation"

// types
import type { ResetPasswordValues } from "@/lib/validation"

const ForgotPasswordForm = () => {
  const forgotPasswordMutation = useSendResetPasswordLink()

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordEmailSchema),
    defaultValues: {
      email: "",
    },
  })

  // submit handler
  const onSubmit = async (values: ResetPasswordValues) => {
    await toast.promise(forgotPasswordMutation.mutateAsync(values), {
      loading: <span className="animate-pulse">Sending reset link...</span>,
      success: "Reset link sent, please check your email",
      error: (error: unknown) => clientErrorHandler(error),
    })

    form.reset()
  }

  return (
    <DynamicForm<ResetPasswordValues>
      form={form}
      onSubmit={onSubmit}
      fields={forgotPasswordFields}
      submitButtonTitle="Send reset link"
      submitButtonClassname="bg-green-500 rounded-3xl"
      submitButtonTitleClassname="text-md font-medium"
      mutation={forgotPasswordMutation}
    />
  )
}

export default ForgotPasswordForm
