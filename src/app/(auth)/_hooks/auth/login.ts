// hooks
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// actions
import { loginAccount } from "@/app/(auth)/_actions/auth/login"

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
      await loginAccount(sanitizedData)
    },
    onSuccess: () => {
      router.push("/admin")
      router.refresh()
    },
    onError: (error) => clientErrorHandler(error),
  })
}
