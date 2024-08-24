"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// utils
import { registerFields } from "@/lib/misc/field-configs"
import { clientErrorHandler } from "@/lib/utils"
import { registerSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"

// hooks
import { useRegisterAccount } from "@/app/(auth)/register/api"
import { useForm } from "react-hook-form"

// types
import type { RegisterValues } from "@/lib/validation"

interface RegisterFormProps {
  onSuccess?: () => void
  onError?: () => void
}

const RegisterForm = ({ onSuccess, onError }: RegisterFormProps) => {
  // init mutation
  const registerMutation = useRegisterAccount()

  // init form
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // submit handler
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
      mutation={registerMutation}
    />
  )
}

export default RegisterForm
