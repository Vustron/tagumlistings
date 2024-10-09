"use client"

//  actions
import resetPasswordLink from "@/lib/actions/auth/reset-link"

// hooks
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// utils
import { clientErrorHandler } from "@/lib/utils"

// types
import type { ResetPasswordValues } from "@/lib/validation"

export const useSendResetPasswordLink = () => {
  const router = useRouter()

  return useMutation({
    mutationKey: ["send-reset-password-link"],
    mutationFn: async (values: ResetPasswordValues) =>
      await resetPasswordLink(values),
    onSuccess: () => {
      router.push("/login")
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
