// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// actions
import { registerAccount } from "@/app/(auth)/_actions/register-account"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { registerSchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { RegisterValues } from "@/lib/validation"

// set purify dom
const purify = DOMPurify

/* --------------create account---------------- */
export const useRegisterAccount = () => {
  // init router
  const router = useRouter()

  // init query client
  const queryClient = useQueryClient()

  return useMutation({
    // set mutation key
    mutationKey: ["register-account"],

    // create user function
    mutationFn: async (values: RegisterValues) => {
      // set unsanitized data
      const unsanitizedData = values

      // init sanitizer
      const sanitizedData = sanitizer<RegisterValues>(
        unsanitizedData,
        registerSchema,
        purify,
      )

      await registerAccount(sanitizedData)
    },

    // on success redirect to verification page
    onSettled: () => {
      // Always refetch after error or success:
      void queryClient.invalidateQueries({ queryKey: ["accounts"] })

      router.refresh()
    },

    // handler error
    onError: (error) => clientErrorHandler(error),
  })
}
