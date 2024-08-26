"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// utils
import { updateAccountFields } from "@/lib/misc/field-configs"
// import { clientErrorHandler } from "@/lib/utils"
import { registerSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
// import toast from "react-hot-toast"

// hooks
// import { useRegisterAccount } from "@/app/(auth)/register/api"
import { useForm } from "react-hook-form"

// types
import type { RegisterValues } from "@/lib/validation"

interface AccountFormProps {
  onSuccess?: () => void
  onError?: () => void
}

const AccountForm = () => {
  // init mutation
  // const registerMutation = useRegisterAccount()

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
    // await toast.promise(registerMutation.mutateAsync(values), {
    //   loading: <span className="animate-pulse">Updating account...</span>,
    //   success: "Account updated",
    //   error: (error: unknown) => clientErrorHandler(error),
    // })

    form.reset()
    // if (registerMutation.isSuccess) {
    //   onSuccess?.()
    // } else {
    //   onError?.()
    // }
    console.log(values)
  }

  return (
    <DynamicForm<RegisterValues>
      form={form}
      onSubmit={submitHandler}
      fields={updateAccountFields}
      submitButtonTitle="Update"
      submitButtonClassname="bg-green-500 rounded-3xl"
      submitButtonTitleClassname="text-md font-medium"
      // mutation={registerMutation}
    />
  )
}

export default AccountForm
