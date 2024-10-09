// utils
import { httpRequest } from "@/lib/config/http"
import { sanitizer } from "@/lib/utils"
import DOMPurify from "dompurify"

// validation
import { newPasswordSchema } from "@/lib/validation"

// types
import type { NewPasswordValues } from "@/lib/validation"
import type { RequestResetPassword } from "@/lib/types"

export default async function resetPassword(values: NewPasswordValues) {
  const URL = "auth/reset-account-password"
  const purify = DOMPurify
  const sanitizedData = sanitizer<NewPasswordValues>(
    values,
    newPasswordSchema,
    purify,
  )

  return await httpRequest<RequestResetPassword>(URL, "POST", {
    body: sanitizedData,
  })
}
