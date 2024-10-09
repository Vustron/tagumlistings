"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// hooks
import { useResetPassword } from "@/lib/hooks/auth/reset-password"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"

// utils
import { newPasswordFields } from "@/lib/misc/field-configs"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"

// validation
import { newPasswordSchema } from "@/lib/validation"

//types
import type { NewPasswordValues } from "@/lib/validation"

const NewPasswordForm = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const resetPasswordMutation = useResetPassword()

  const form = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      token: token,
      password: "",
    },
  })

  const onSubmit = async (values: NewPasswordValues) => {
    await toast.promise(resetPasswordMutation.mutateAsync(values), {
      loading: <span className="animate-pulse">Resetting password...</span>,
      success: "Password reset successful",
      error: (error: unknown) => clientErrorHandler(error),
    })

    form.reset()
  }

  return (
    <DynamicForm<NewPasswordValues>
      form={form}
      onSubmit={onSubmit}
      fields={newPasswordFields}
      submitButtonTitle="Reset Password"
      submitButtonClassname="bg-green-500 rounded-3xl"
      submitButtonTitleClassname="text-md font-medium"
      mutation={resetPasswordMutation}
    />
  )
}

export default NewPasswordForm
