"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// utils
import { dataSerializer } from "@/lib/utils"
import { updateAccountFields } from "@/lib/misc/field-configs"
import { clientErrorHandler } from "@/lib/utils"
import { updateAccountSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"

// hooks
import { useGetAccount } from "@/app/(auth)/_hooks/use-get-account"
import { useUpdateAccount } from "@/app/(auth)/_hooks/use-update-account"
import { useForm } from "react-hook-form"

// types
import type { UpdateAccountValues } from "@/lib/validation"
import type { SessionData } from "@/lib/config/session"

interface AccountFormProps {
  id?: string | undefined
}

const AccountForm = ({ id }: AccountFormProps) => {
  const { data: user } = useGetAccount(id)

  const userData: SessionData | undefined = user
    ? dataSerializer(user)
    : undefined

  const updateAccountMutation = useUpdateAccount(id)

  const form = useForm<UpdateAccountValues>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      id: userData?.id,
      name: userData?.name,
      address: userData?.address,
      contact_number: userData?.contact_number,
      email: userData?.email,
      role: userData?.role,
      password: undefined,
      newpassword: undefined,
    },
  })

  // submit handler
  const onSubmit = async (values: UpdateAccountValues) => {
    console.log("Form Submitted", values)
    await toast.promise(updateAccountMutation.mutateAsync(values), {
      loading: <span className="animate-pulse">Updating account...</span>,
      success: "Account updated",
      error: (error: unknown) => clientErrorHandler(error),
    })
    form.reset(values)
  }

  return (
    <>
      <DynamicForm<UpdateAccountValues>
        form={form}
        onSubmit={onSubmit}
        fields={updateAccountFields}
        submitButtonTitle="Update"
        submitButtonClassname="bg-green-500 rounded-3xl"
        submitButtonTitleClassname="text-md font-medium"
        mutation={updateAccountMutation}
      />
    </>
  )
}

export default AccountForm
