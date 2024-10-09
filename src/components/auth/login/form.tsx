"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// utils
import { loginFields } from "@/lib/misc/field-configs"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientErrorHandler } from "@/lib/utils"
import { loginSchema } from "@/lib/validation"
import toast from "react-hot-toast"

// hooks
import { useLoginAccount } from "@/lib/hooks/auth/login"
import { useForm } from "react-hook-form"

// types
import type { LoginValues } from "@/lib/validation"

const LoginForm = () => {
  const loginMutation = useLoginAccount()
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // submit handler
  const submitHandler = async (values: LoginValues) => {
    await toast.promise(loginMutation.mutateAsync(values), {
      loading: <span className="animate-pulse">Logging in...</span>,
      success: "User logged in",
      error: (error: unknown) => clientErrorHandler(error),
    })
    form.reset()
  }

  return (
    <DynamicForm<LoginValues>
      form={form}
      onSubmit={submitHandler}
      fields={loginFields}
      submitButtonTitle="Login"
      submitButtonClassname="bg-green-500 rounded-3xl"
      submitButtonTitleClassname="text-md font-medium"
      mutation={loginMutation}
      isSignIn
    />
  )
}

export default LoginForm
