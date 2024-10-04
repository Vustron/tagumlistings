"use client"

// hooks
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// actions
import { loginAccount } from "@/lib/actions/auth/login"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { loginSchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { LoginValues } from "@/lib/validation"

const purify = DOMPurify

export const useLoginAccount = () => {
  const router = useRouter()

  return useMutation({
    mutationKey: ["login-account"],
    mutationFn: async (values: LoginValues) => {
      const sanitizedData = sanitizer<LoginValues>(values, loginSchema, purify)
      return await loginAccount(sanitizedData)
    },
    onSuccess: (data) => {
      if (data.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/")
      }
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
