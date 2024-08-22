"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// utils
import { loginFields } from "@/lib/misc/field-configs"
import { clientErrorHandler } from "@/lib/utils"
import { loginSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"

// hooks
// import { useLoginAccount } from "@/app/(auth)/login/api"
import { useForm } from "react-hook-form"

// types
import type { LoginValues } from "@/lib/validation"

// TODO: 🛠️ work in progress login mutation

const LoginForm = () => {
  // init mutation
  // const loginMutation = useLoginAccount()

  // init form
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // submit handler
  const submitHandler = async (values: LoginValues) => {
    // await toast.promise(loginMutation.mutateAsync(values), {
    //   loading: <span className="animate-pulse">Logging in...</span>,
    //   success: "User logged in",
    //   error: (error: unknown) => clientErrorHandler(error),
    // })

    form.reset()
  }

  return (
    <DynamicForm<LoginValues>
      form={form}
      onSubmit={submitHandler}
      fields={loginFields}
      submitButtonTitle="Login"
      // mutation={() => {}}
    />
  )
}

export default LoginForm
