"use client"

// actions
import resetPassword from "@/lib/actions/auth/reset-password"

// hooks
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// utils
import { clientErrorHandler } from "@/lib/utils"

// types
import type { NewPasswordValues } from "@/lib/validation"

export const useResetPassword = () => {
  const router = useRouter()

  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (values: NewPasswordValues) =>
      await resetPassword(values),
    onSuccess: () => {
      router.push("/login")
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
