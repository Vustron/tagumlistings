"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// utils
import { registerFields } from "@/lib/misc/field-configs"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/lib/validation"
import { clientErrorHandler } from "@/lib/utils"
import toast from "react-hot-toast"

// hooks
import { useRegisterAccount } from "@/lib/hooks/auth/register"
import { useForm } from "react-hook-form"

// types
import type { RegisterValues } from "@/lib/validation"

interface RegisterFormProps {
  onSuccess?: () => void
  onError?: () => void
  status?: "client" | "admin"
}

const RegisterForm = ({ onSuccess, onError, status }: RegisterFormProps) => {
  const registerMutation = useRegisterAccount(status)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      address: "",
      contact_number: "",
      email: "",
      password: "",
    },
  })

  const submitHandler = async (values: RegisterValues) => {
    await toast.promise(registerMutation.mutateAsync(values), {
      loading: <span className="animate-pulse">Registering...</span>,
      success: "Account registered",
      error: (error: unknown) => clientErrorHandler(error),
    })

    form.reset()
    if (registerMutation.isSuccess) {
      onSuccess?.()
    } else {
      onError?.()
    }
  }

  return (
    <DynamicForm<RegisterValues>
      form={form}
      onSubmit={submitHandler}
      fields={registerFields}
      submitButtonTitle="Register"
      submitButtonClassname="bg-green-500 rounded-3xl"
      submitButtonTitleClassname="text-md font-medium"
      mutation={registerMutation}
    />
  )
}

export default RegisterForm
